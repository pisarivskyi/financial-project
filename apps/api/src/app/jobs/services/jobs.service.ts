import { InjectFlowProducer, InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FlowChildJob, FlowProducer, Job, JobNode, Queue } from 'bullmq';
import { DateTime } from 'luxon';
import { Repository } from 'typeorm';

import { UserInterface } from '@financial-project/common';

import { AccountEntity } from '../../accounts/entities/account.entity';
import { RecordEntity } from '../../records/entities/record.entity';
import { ACCOUNT_SYNC_QUEUE_NAME } from '../constants/account-sync-queue-name.const';
import { RECORDS_SYNC_QUEUE_NAME } from '../constants/records-sync-queue-name.const';
import { CreateJobDto } from '../dtos/create-job.dto';
import { JobPayloadInterface } from '../interfaces/job-payload.interface';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(AccountEntity) private accountsRepository: Repository<AccountEntity>,
    @InjectRepository(RecordEntity) private recordsRepository: Repository<RecordEntity>,
    @InjectFlowProducer(ACCOUNT_SYNC_QUEUE_NAME) private accountsSyncQueue: FlowProducer,
    @InjectQueue(RECORDS_SYNC_QUEUE_NAME) private recordsSyncQueue: Queue
  ) {}

  async create(createJobDto: CreateJobDto, user: UserInterface): Promise<JobNode> {
    try {
      const account = await this.accountsRepository.findOne({
        where: {
          id: createJobDto.accountId,
          createdBy: user.sub,
        },
        relations: {
          provider: true,
        },
      });

      if (!account || !account.provider) {
        throw new Error();
      }

      const fromDate = DateTime.fromJSDate(createJobDto.fromDate);
      const toDate = DateTime.fromJSDate(createJobDto.toDate);

      const days = toDate.diff(fromDate, 'days').get('days');

      if (days <= 31) {
        return await this.accountsSyncQueue.add({
          name: 'name',
          queueName: ACCOUNT_SYNC_QUEUE_NAME,
          data: {
            accountId: account.id,
            userId: user.sub,
            fromDate: fromDate.toISODate(),
            toDate: toDate.toISODate(),
          },
          children: [this.createFlowChildJob(account.id, user.sub, fromDate, toDate)],
        });
      } else {
        const jobs: FlowChildJob[] = [];
        let cloneFromDate = toDate.minus({ days: 31 });
        let cloneToDate = toDate;

        do {
          jobs.push(this.createFlowChildJob(account.id, user.sub, cloneFromDate, cloneToDate));

          cloneFromDate = cloneFromDate.minus({ days: 31 });
          cloneToDate = cloneToDate.minus({ days: 31 });
        } while (cloneFromDate > fromDate);

        cloneFromDate = cloneFromDate.plus({ days: 31 });

        jobs.push(this.createFlowChildJob(account.id, user.sub, fromDate, cloneFromDate));

        return await this.accountsSyncQueue.add({
          name: 'name',
          queueName: ACCOUNT_SYNC_QUEUE_NAME,
          data: {
            accountId: account.id,
            userId: user.sub,
            fromDate: fromDate.toISODate(),
            toDate: toDate.toISODate(),
          },
          children: jobs,
        });
      }
    } catch {
      throw new BadRequestException();
    }
  }

  async findOne(id: string, user: UserInterface): Promise<JobNode> {
    const jobNode = await this.accountsSyncQueue.getFlow({
      id,
      queueName: ACCOUNT_SYNC_QUEUE_NAME,
    });

    if (!jobNode || jobNode.job.data.userId !== user.sub) {
      throw new NotFoundException('Job not found');
    }

    return jobNode;
  }

  // TODO: think about implementing this method
  async findAll(user: UserInterface): Promise<Job<JobPayloadInterface>[]> {
    return [];
    // const jobs = await this.accountsSyncQueue.getFlow([]);
    //
    // return jobs.filter((job) => job.data.userId === user.sub);
  }

  private createFlowChildJob(accountId: string, userId: string, fromDate: DateTime, toDate: DateTime): FlowChildJob {
    return {
      name: 'name',
      queueName: RECORDS_SYNC_QUEUE_NAME,
      data: {
        accountId,
        userId,
        fromDate: fromDate.toISODate(),
        toDate: toDate.toISODate(),
      },
      opts: {
        attempts: 4,
        backoff: {
          type: 'fixed',
          delay: 60000,
        },
      },
    };
  }
}
