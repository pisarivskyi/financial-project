import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { DateTime } from 'luxon';
import { firstValueFrom, map } from 'rxjs';
import { In, Repository } from 'typeorm';

import {
  ApiMonobank,
  ApiMonobankProviderService,
  RecordCreationTypeEnum,
  RecordTypeEnum,
} from '@financial-project/common';

import { CategoriesService } from '../../categories/categories.service';
import { RecordEntity } from '../../records/entities/record.entity';
import { ACCOUNT_JOB_QUEUE_NAME } from '../constants/account-job-queue-name.const';
import { AccountEntity } from '../entities/account.entity';
import { AccountJobTypeEnum } from '../enums/account-job-type.enum';
import { AccountJobPayloadInterface } from '../interfaces/account-job-payload.interface';

@Processor(ACCOUNT_JOB_QUEUE_NAME)
export class AccountSynchronizationProcessorService {
  private readonly logger = new Logger(AccountSynchronizationProcessorService.name);

  constructor(
    @InjectRepository(AccountEntity) private accountsRepository: Repository<AccountEntity>,
    @InjectRepository(RecordEntity) private recordsRepository: Repository<RecordEntity>,
    private categoriesService: CategoriesService,
    private apiMonobankProviderService: ApiMonobankProviderService
  ) {}

  @Process(AccountJobTypeEnum.RegularSync)
  async regularSyncProcess(job: Job<AccountJobPayloadInterface>): Promise<void> {
    this.logger.debug(`received job for account '${job.data.accountId}'`);

    try {
      const account = await this.accountsRepository.findOne({
        where: {
          id: job.data.accountId,
        },
        relations: {
          provider: true,
        },
      });

      if (!account) {
        throw new Error(`No account with such id ('${job.data.accountId}') was found`);
      }

      // TODO: assign proper category
      // const categories = await this.categoriesService.findAll({
      //
      // });

      const statements = await firstValueFrom(
        this.apiMonobankProviderService
          .getStatement$(
            account.provider.data.token,
            account.bankAccountId,
            DateTime.now().minus({ days: 31 }),
            DateTime.now()
          )
          .pipe(map((r) => r.data))
      );

      const records = statements.map((statement) => {
        return this.toRecordEntity(statement, account);
      });

      const recordBankIds = records.map((record) => record.bankRecordId);

      const existingRecords = await this.recordsRepository.find({
        where: {
          bankRecordId: In(recordBankIds),
        },
      });
      const existingRecordBankIds = existingRecords.map((record) => record.bankRecordId);

      const recordsToSave = records.filter((record) => !existingRecordBankIds.includes(record.bankRecordId));

      if (recordsToSave.length) {
        const savedRecords = await this.recordsRepository.save(recordsToSave);

        account.lastSyncDate = new Date();

        await this.accountsRepository.update(account.id, account);

        this.logger.debug(`saved ${savedRecords.length} records for account '${job.data.accountId}'`);
      } else {
        this.logger.debug(`records for account '${job.data.accountId}' are up to date`);
      }
    } catch (error) {
      this.logger.error(`failed to process job for account '${job.data.accountId}'`);

      throw error;
    }
  }

  private toRecordEntity(statement: ApiMonobank.Statement.StatementInterface, account: AccountEntity): RecordEntity {
    const record = new RecordEntity();

    record.bankRecordId = statement.id;
    record.bankCreatedAt = DateTime.fromSeconds(statement.time).toJSDate();
    record.name = statement.description;
    record.comment = statement.comment;
    record.amount = Math.abs(statement.amount);
    record.type = Math.sign(statement.amount) === 1 ? RecordTypeEnum.Income : RecordTypeEnum.Outcome;
    record.account = account;
    record.balance = statement.balance;
    // record.category?: CategoryInterface;
    record.creationType = RecordCreationTypeEnum.Synced;
    record.currencyCode = statement.currencyCode;
    record.description = statement.description;
    record.mcc = statement.mcc;
    record.metadata = statement;
    record.createdBy = account.createdBy;

    return record;
  }
}
