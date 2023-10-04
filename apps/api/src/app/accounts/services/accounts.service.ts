import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job, Queue } from 'bull';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { In, Repository } from 'typeorm';

import { UserInterface } from '@financial-project/common';

import { PageOptionsDto } from '../../core/pagination/dtos/page-options.dto';
import { PageDto } from '../../core/pagination/dtos/page.dto';
import { paginate } from '../../core/pagination/utils/paginate.utils';
import { RecordEntity } from '../../records/entities/record.entity';
import { ACCOUNT_JOB_QUEUE_NAME } from '../constants/account-job-queue-name.const';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { AccountEntity } from '../entities/account.entity';
import { AccountJobTypeEnum } from '../enums/account-job-type.enum';
import { AccountJobPayloadInterface } from '../interfaces/account-job-payload.interface';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountEntity) private accountsRepository: Repository<AccountEntity>,
    @InjectRepository(RecordEntity) private recordsRepository: Repository<RecordEntity>,
    @InjectQueue(ACCOUNT_JOB_QUEUE_NAME) private accountSyncQueue: Queue
  ) {}

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

  async sync(id: string, user: UserInterface): Promise<Job<AccountJobPayloadInterface>> {
    try {
      const account = await this.accountsRepository.findOne({
        where: {
          id,
          createdBy: user.sub,
        },
        relations: {
          provider: true,
        },
      });

      if (!account || !account.provider) {
        throw new Error();
      }

      return await this.accountSyncQueue.add(AccountJobTypeEnum.RegularSync, {
        accountId: account.id,
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async getJobById(id: string): Promise<Job<any>> {
    const job = await this.accountSyncQueue.getJob(id);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }
}
