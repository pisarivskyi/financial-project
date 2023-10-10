import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { In, Repository } from 'typeorm';

import { UserInterface } from '@financial-project/common';

import { PageOptionsDto } from '../core/pagination/dtos/page-options.dto';
import { PageDto } from '../core/pagination/dtos/page.dto';
import { paginate } from '../core/pagination/utils/paginate.utils';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountEntity } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(@InjectRepository(AccountEntity) private accountsRepository: Repository<AccountEntity>) {}

  saveAll(accounts: AccountEntity[]): Promise<AccountEntity[]> {
    return this.accountsRepository.save(accounts);
  }

  create(createAccountDto: CreateAccountDto, user: UserInterface): Promise<AccountEntity> {
    const account = plainToInstance(AccountEntity, createAccountDto);
    account.createdBy = user.sub;

    return this.accountsRepository.save(account);
  }

  findAll(params: PageOptionsDto, user: UserInterface): Promise<PageDto<AccountEntity>> {
    return paginate(this.accountsRepository, params, {
      where: {
        createdBy: user.sub,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findAllByBankIds(bankIds: string[], user: UserInterface): Promise<AccountEntity[]> {
    return this.accountsRepository.find({
      where: {
        bankAccountId: In(bankIds),
        createdBy: user.sub,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string, user: UserInterface): Promise<AccountEntity> {
    try {
      const account = await this.accountsRepository.findOne({
        where: {
          id,
          createdBy: user.sub,
        },
      });

      if (!account) {
        throw new Error();
      }

      return account;
    } catch {
      throw new NotFoundException();
    }
  }

  async update(id: string, updateAccountDto: UpdateAccountDto, user: UserInterface): Promise<AccountEntity> {
    const targetAccount = await this.accountsRepository.findOne({
      where: {
        id,
        createdBy: user.sub,
      },
    });

    if (!targetAccount) {
      throw new NotFoundException();
    }

    const updatedAccount = plainToClassFromExist(targetAccount, updateAccountDto);

    await this.accountsRepository.update(id, updatedAccount);

    return this.findOne(id, user);
  }

  async remove(id: string, user: UserInterface): Promise<AccountEntity> {
    const targetAccount = await this.accountsRepository.findOne({
      where: {
        id,
        createdBy: user.sub,
      },
    });

    if (!targetAccount) {
      throw new NotFoundException();
    }

    return this.accountsRepository.remove(targetAccount);
  }
}
