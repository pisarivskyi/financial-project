import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { In, Repository } from 'typeorm';

import { UserEntity } from '../users/entities/user.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountEntity } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(@InjectRepository(AccountEntity) private accountsRepository: Repository<AccountEntity>) {}

  saveAll(accounts: AccountEntity[]): Promise<AccountEntity[]> {
    return this.accountsRepository.save(accounts);
  }

  create(createAccountDto: CreateAccountDto, user: UserEntity): Promise<AccountEntity> {
    const account = plainToInstance(AccountEntity, createAccountDto);
    account.createdBy = user;

    return this.accountsRepository.save(account);
  }

  findAll(user: UserEntity): Promise<AccountEntity[]> {
    return this.accountsRepository.find({
      where: {
        createdBy: {
          id: user.id,
        },
      },
    });
  }

  findAllByBankIds(bankIds: string[], user: UserEntity): Promise<AccountEntity[]> {
    return this.accountsRepository.find({
      where: {
        bankAccountId: In(bankIds),
        createdBy: {
          id: user.id,
        },
      },
    });
  }

  async findOne(id: string, user: UserEntity): Promise<AccountEntity> {
    try {
      const account = await this.accountsRepository.findOne({
        where: {
          id,
          createdBy: {
            id: user.id,
          },
        },
        relations: {
          createdBy: true,
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

  async update(id: string, updateAccountDto: UpdateAccountDto, user: UserEntity): Promise<AccountEntity> {
    const targetAccount = await this.accountsRepository.findOne({
      where: {
        id,
        createdBy: {
          id: user.id,
        },
      },
    });

    if (!targetAccount) {
      throw new NotFoundException();
    }

    const updatedAccount = plainToClassFromExist(targetAccount, updateAccountDto);

    await this.accountsRepository.update(id, updatedAccount);

    return this.findOne(id, user);
  }

  async remove(id: string, user: UserEntity): Promise<AccountEntity> {
    const targetAccount = await this.accountsRepository.findOne({
      where: {
        id,
        createdBy: {
          id: user.id,
        },
      },
    });

    if (!targetAccount) {
      throw new NotFoundException();
    }

    return this.accountsRepository.remove(targetAccount);
  }
}
