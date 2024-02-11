import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { IsNull, Not, Repository } from 'typeorm';

import { ProviderTypeEnum } from '@financial-project/common';

import { AccountEntity } from '../../accounts/entities/account.entity';
import { JobsService } from './jobs.service';

@Injectable()
export class TaskSchedulerService {
  private readonly logger = new Logger(TaskSchedulerService.name);

  constructor(
    @InjectRepository(AccountEntity) private accountsRepository: Repository<AccountEntity>,
    private jobsService: JobsService,
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
      await this.jobsService.create(
        {
          accountId: account.id,
          fromDate: DateTime.now().minus({ days: 31 }).toJSDate(),
          toDate: DateTime.now().toJSDate(),
        },
        {
          id: account.createdBy,
        },
      );

      this.logger.debug(`sync job is scheduled for '${account.id}'`);
    }
  }
}
