import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import { DateTime } from 'luxon';
import { firstValueFrom, map } from 'rxjs';
import { In, Repository } from 'typeorm';

import { RecordCreationTypeEnum, RecordTypeEnum } from '@financial-project/common';
import { ApiMonobank, ApiMonobankProviderService } from '@financial-project/providers';

import { AccountEntity } from '../../accounts/entities/account.entity';
import { CategoriesService } from '../../categories/categories.service';
import { RecordEntity } from '../../records/entities/record.entity';
import { RECORDS_SYNC_QUEUE_NAME } from '../constants/records-sync-queue-name.const';
import { JobPayloadInterface } from '../interfaces/job-payload.interface';

@Processor(RECORDS_SYNC_QUEUE_NAME)
export class RecordsSynchronizationProcessorService extends WorkerHost {
  private readonly logger = new Logger(RecordsSynchronizationProcessorService.name);

  constructor(
    @InjectRepository(AccountEntity) private accountsRepository: Repository<AccountEntity>,
    @InjectRepository(RecordEntity) private recordsRepository: Repository<RecordEntity>,
    private categoriesService: CategoriesService,
    private apiMonobankProviderService: ApiMonobankProviderService
  ) {
    super();
  }

  async process(job: Job<JobPayloadInterface>): Promise<void> {
    this.logger.debug(`received job for account '${job.data.accountId}'`);
    this.logger.debug(`records will be synced in the period: ${job.data.fromDate} - ${job.data.toDate}`);

    try {
      const account = await this.getAccount(job.data.accountId);

      if (!account) {
        throw new Error(`No account with such id ('${job.data.accountId}') was found`);
      }

      // load records from provider account
      const records = await this.getRecordsFromMonobankAccount(
        account,
        DateTime.fromISO(job.data.fromDate),
        DateTime.fromISO(job.data.toDate)
      );

      // filter already existing records
      const recordBankIds = records.map((record) => record.bankRecordId);

      const existingRecords = await this.recordsRepository.find({
        where: {
          bankRecordId: In(recordBankIds),
        },
      });
      const existingRecordBankIds = existingRecords.map((record) => record.bankRecordId);

      // find records to save
      const recordsToSave = records.filter((record) => !existingRecordBankIds.includes(record.bankRecordId));

      if (recordsToSave.length) {
        const savedRecords = await this.recordsRepository.save(recordsToSave);

        this.logger.debug(`saved ${savedRecords.length} records for account '${job.data.accountId}'`);
      } else {
        this.logger.debug(`records for account '${job.data.accountId}' are up to date`);
      }
    } catch (error) {
      this.logger.error(`failed to process job for account '${job.data.accountId}'`);

      throw error;
    }
  }

  private async getAccount(accountId: string): Promise<AccountEntity> {
    return this.accountsRepository.findOne({
      where: {
        id: accountId,
      },
      relations: {
        provider: true,
      },
    });
  }

  private async getRecordsFromMonobankAccount(account: AccountEntity, fromDate: DateTime, toDate: DateTime) {
    const statements = await firstValueFrom(
      this.apiMonobankProviderService
        .getStatement$(account.provider.data.token, account.bankAccountId, fromDate, toDate)
        .pipe(map((r) => r.data))
    );

    return statements.map((statement) => {
      return this.toRecordEntity(statement, account);
    });
  }

  private toRecordEntity(statement: ApiMonobank.Statement.StatementInterface, account: AccountEntity): RecordEntity {
    const record = new RecordEntity();

    record.bankRecordId = statement.id;
    record.bankCreatedAt = DateTime.fromSeconds(statement.time).toJSDate();
    record.name = statement.description;
    record.comment = statement.comment;
    record.amount = Math.abs(statement.amount);
    record.operationAmount = Math.abs(statement.operationAmount);
    record.type = Math.sign(statement.amount) === 1 ? RecordTypeEnum.Income : RecordTypeEnum.Outcome;
    record.account = account;
    record.balance = statement.balance;
    // record.category?: CategoryInterface;
    record.creationType = RecordCreationTypeEnum.Synced;
    record.currencyCode = account.currencyCode;
    record.operationCurrencyCode = statement.currencyCode;
    record.description = statement.description;
    record.mcc = statement.mcc;
    record.metadata = statement;
    record.createdBy = account.createdBy;

    return record;
  }
}
