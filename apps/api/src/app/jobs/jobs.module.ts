import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonobankModule } from '@financial-project/providers';

import { AccountEntity } from '../accounts/entities/account.entity';
import { CategoriesModule } from '../categories/categories.module';
import { RecordEntity } from '../records/entities/record.entity';
import { ACCOUNT_SYNC_QUEUE_NAME } from './constants/account-sync-queue-name.const';
import { RECORDS_SYNC_QUEUE_NAME } from './constants/records-sync-queue-name.const';
import { JobsController } from './jobs.controller';
import { AccountSynchronizationProcessorService } from './services/account-synchronization-processor.service';
import { JobsService } from './services/jobs.service';
import { RecordsSynchronizationProcessorService } from './services/records-synchronization-processor.service';
import { TaskSchedulerService } from './services/task-scheduler.service';

@Module({
  providers: [
    JobsService,
    AccountSynchronizationProcessorService,
    RecordsSynchronizationProcessorService,
    TaskSchedulerService,
  ],
  controllers: [JobsController],
  imports: [
    TypeOrmModule.forFeature([AccountEntity, RecordEntity]),
    CategoriesModule,
    MonobankModule,
    BullModule.registerQueue({
      name: RECORDS_SYNC_QUEUE_NAME,
      defaultJobOptions: {
        attempts: 4,
        backoff: {
          type: 'fixed',
          delay: 5000,
        },
      },
    }),
    BullModule.registerFlowProducer({
      name: ACCOUNT_SYNC_QUEUE_NAME,
    }),
  ],
})
export class JobsModule {}
