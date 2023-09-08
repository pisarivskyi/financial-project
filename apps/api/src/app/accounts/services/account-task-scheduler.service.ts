import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { IsNull, Not, Repository } from 'typeorm';

import { ProviderTypeEnum } from '@financial-project/common';

import { ACCOUNT_JOB_QUEUE_NAME } from '../constants/account-job-queue-name.const';
import { AccountEntity } from '../entities/account.entity';
import { AccountJobTypeEnum } from '../enums/account-job-type.enum';

@Injectable()
export class AccountTaskSchedulerService {
  private readonly logger = new Logger(AccountTaskSchedulerService.name);

  constructor(
    @InjectQueue(ACCOUNT_JOB_QUEUE_NAME) private accountSyncQueue: Queue,
    @InjectRepository(AccountEntity) private accountsRepository: Repository<AccountEntity>
  ) {}

  @Cron('5 * * * * *', { disabled: true })
  async handleCron(): Promise<void> {
    const accounts = await this.accountsRepository.find({
      where: {
        providerType: Not(ProviderTypeEnum.Manual),
        provider: Not(IsNull()),
      },
      relations: {
        provider: true,
      },
    });

    for (const account of accounts) {
      await this.accountSyncQueue.add(AccountJobTypeEnum.RegularSync, {
        accountId: account.id,
      });

      this.logger.debug(`sync job is scheduled for '${account.id}'`);
    }
  }
}
