import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClassFromExist } from 'class-transformer';
import { firstValueFrom, map } from 'rxjs';
import { Repository } from 'typeorm';

import { AccountTypeEnum, ProviderTypeEnum, UserTokenParsedInterface } from '@financial-project/common';
import { ApiMonobankProviderService } from '@financial-project/providers';

import { AccountsService } from '../../accounts/accounts.service';
import { AccountEntity } from '../../accounts/entities/account.entity';
import { PageOptionsDto } from '../../core/pagination/dtos/page-options.dto';
import { PageDto } from '../../core/pagination/dtos/page.dto';
import { paginate } from '../../core/pagination/utils/paginate.utils';
import { CreateProviderDto } from '../dto/create-provider.dto';
import { ProviderAccountsDto } from '../dto/provider-accounts.dto';
import { SaveAccountsDto } from '../dto/save-accounts.dto';
import { UpdateProviderDto } from '../dto/update-provider.dto';
import { ProviderEntity } from '../entities/provider.entity';
import { IssuerService } from './issuer.service';
import { ProviderFactoryService } from './provider-factory.service';

@Injectable()
export class ProvidersService {
  constructor(
    private readonly providerFactoryService: ProviderFactoryService,
    private readonly issuerService: IssuerService,
    private readonly accountsService: AccountsService,
    private readonly apiMonobankProviderService: ApiMonobankProviderService,
    @InjectRepository(ProviderEntity) private readonly providersRepository: Repository<ProviderEntity>,
  ) {}

  findAll(params: PageOptionsDto, user: UserTokenParsedInterface): Promise<PageDto<ProviderEntity>> {
    return paginate(this.providersRepository, params, {
      where: {
        createdBy: user.sub,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string, user: UserTokenParsedInterface): Promise<ProviderEntity> {
    try {
      const provider = await this.providersRepository.findOne({
        where: {
          id,
          createdBy: user.sub,
        },
      });

      if (!provider) {
        throw new Error();
      }

      return provider;
    } catch {
      throw new NotFoundException();
    }
  }

  create(
    createProviderDto: CreateProviderDto,
    providerType: ProviderTypeEnum,
    user: UserTokenParsedInterface,
  ): Promise<ProviderEntity> {
    const provider = this.providerFactoryService.create(providerType, createProviderDto);
    provider.createdBy = user.sub;

    return this.providersRepository.save(provider);
  }

  async update(
    id: string,
    updateAccountDto: UpdateProviderDto,
    user: UserTokenParsedInterface,
  ): Promise<ProviderEntity> {
    const targetProvider = await this.providersRepository.findOne({
      where: {
        id,
        createdBy: user.sub,
      },
    });

    if (!targetProvider) {
      throw new NotFoundException();
    }

    const updatedProvider = plainToClassFromExist(targetProvider, updateAccountDto);

    await this.providersRepository.update(id, updatedProvider);

    return this.findOne(id, user);
  }

  async remove(id: string, user: UserTokenParsedInterface): Promise<ProviderEntity> {
    const targetProvider = await this.providersRepository.findOne({
      where: {
        id,
        createdBy: user.sub,
      },
    });

    if (!targetProvider) {
      throw new NotFoundException();
    }

    return this.providersRepository.remove(targetProvider);
  }

  async saveAccounts(providerId: string, saveAccountsDto: SaveAccountsDto, user: UserTokenParsedInterface) {
    try {
      const existingAccounts = await this.accountsService.findAllByBankIds(saveAccountsDto.accountIds, user);

      if (existingAccounts.length) {
        throw new BadRequestException('Some accounts already exists');
      }

      const provider = await this.providersRepository.findOne({
        where: {
          id: providerId,
          createdBy: user.sub,
        },
      });

      if (!provider) {
        throw new NotFoundException('Provider not found');
      }

      const accountsResponse = await firstValueFrom(
        this.apiMonobankProviderService.getClientInfo$(provider.data.token).pipe(map((r) => r.data)),
      );

      const selectedAccounts = accountsResponse.accounts.filter((account) =>
        saveAccountsDto.accountIds.includes(account.id),
      );

      const accountEntities = selectedAccounts.map((monobankAccount) => {
        const account = new AccountEntity();
        account.name = `${provider.providerType} ${monobankAccount.type}`;
        account.type = monobankAccount.creditLimit ? AccountTypeEnum.CreditCard : AccountTypeEnum.DebitCard;
        account.provider = provider;
        account.issuer = this.issuerService.getIssuer(monobankAccount.maskedPan[0]);
        account.providerType = ProviderTypeEnum.Monobank;
        account.bankAccountId = monobankAccount.id;
        account.bankSpecificType = monobankAccount.type;
        account.currencyCode = monobankAccount.currencyCode;
        account.maskedPan = monobankAccount.maskedPan[0];
        account.balance = monobankAccount.balance;
        account.creditLimit = monobankAccount.creditLimit;
        account.metadata = monobankAccount;
        account.createdBy = user.sub;

        return account;
      });

      return this.accountsService.saveAll(accountEntities);
    } catch (error) {
      if (error?.response?.status === HttpStatus.TOO_MANY_REQUESTS) {
        throw new BadRequestException('Too many requests');
      }

      throw error;
    }
  }

  async getAccounts(providerId: string, user: UserTokenParsedInterface): Promise<ProviderAccountsDto> {
    const provider = await this.providersRepository.findOne({
      where: {
        id: providerId,
        providerType: ProviderTypeEnum.Monobank,
        createdBy: user.sub,
      },
    });

    if (!provider) {
      throw new NotFoundException('No provider found ');
    }

    switch (provider.providerType) {
      case ProviderTypeEnum.Monobank: {
        return this.getAccountsFromMonobank(provider);
      }

      default: {
        throw new Error('Unknown provider type');
      }
    }
  }

  private async getAccountsFromMonobank(provider: ProviderEntity): Promise<ProviderAccountsDto> {
    try {
      const result = await firstValueFrom<ProviderAccountsDto>(
        this.apiMonobankProviderService.getClientInfo$(provider.data.token).pipe(
          map(({ data }) => {
            const accountsData = new ProviderAccountsDto();
            accountsData.providerId = provider.id;
            accountsData.clientId = data.clientId;
            accountsData.providerType = ProviderTypeEnum.Monobank;
            accountsData.originalData = data;

            accountsData.accounts = data.accounts.map(({ id, maskedPan, currencyCode, balance, creditLimit }) => ({
              id,
              maskedPan: maskedPan[0],
              currencyCode,
              balance,
              creditLimit,
            }));

            return accountsData;
          }),
        ),
      );

      return result;
    } catch (error) {
      if (error?.response?.status === HttpStatus.TOO_MANY_REQUESTS) {
        throw new BadRequestException('Too many requests');
      }

      throw error;
    }
  }
}
