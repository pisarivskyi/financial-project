import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonobankModule } from '@financial-project/common';

import { CategoriesModule } from '../categories/categories.module';
import { RecordEntity } from '../records/entities/record.entity';
import { AccountsController } from './accounts.controller';
import { ACCOUNT_JOB_QUEUE_NAME } from './constants/account-job-queue-name.const';
import { AccountEntity } from './entities/account.entity';
import { AccountSynchronizationProcessorService } from './services/account-synchronization-processor.service';
import { AccountTaskSchedulerService } from './services/account-task-scheduler.service';
import { AccountsService } from './services/accounts.service';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, AccountTaskSchedulerService, AccountSynchronizationProcessorService],
  imports: [
    TypeOrmModule.forFeature([AccountEntity, RecordEntity]),
    MonobankModule,
    CategoriesModule,
    BullModule.registerQueue({
      name: ACCOUNT_JOB_QUEUE_NAME,
      defaultJobOptions: {
        attempts: 3,
        backoff: 60000,
      },
      settings: {
        retryProcessDelay: 60000,
      },
    }),
  ],
  exports: [AccountsService],
})
export class AccountsModule {}
