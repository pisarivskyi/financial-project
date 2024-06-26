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
import { CategoryEntity } from '../../categories/entities/category.entity';
import { CurrencyRatesService } from '../../currency-rates/currency-rates.service';
import { RecordEntity } from '../../records/entities/record.entity';
import { RECORDS_SYNC_QUEUE_NAME } from '../constants/records-sync-queue-name.const';
import { JobPayloadInterface } from '../interfaces/job-payload.interface';
import { CategoryAssignerService } from './category-assigner.service';
import { CompanyAssignerService } from './company-assigner.service';

@Processor(RECORDS_SYNC_QUEUE_NAME)
export class RecordsSynchronizationProcessorService extends WorkerHost {
  private readonly logger = new Logger(RecordsSynchronizationProcessorService.name);

  constructor(
    @InjectRepository(AccountEntity) private accountsRepository: Repository<AccountEntity>,
    @InjectRepository(RecordEntity) private recordsRepository: Repository<RecordEntity>,
    @InjectRepository(CategoryEntity) private categoriesRepository: Repository<CategoryEntity>,
    private categoryAssignerService: CategoryAssignerService,
    private companyAssignerService: CompanyAssignerService,
    private apiMonobankProviderService: ApiMonobankProviderService,
    private currencyRatesService: CurrencyRatesService,
  ) {
    super();
  }

  async process(job: Job<JobPayloadInterface>): Promise<void> {
    this.debug(job, `received job for account '${job.data.accountId}'`);
    this.debug(job, `records will be synced in the period: ${job.data.fromDate} - ${job.data.toDate}`);

    try {
      const account = await this.getAccount(job.data.accountId);

      if (!account) {
        throw new Error(`No account with such id ('${job.data.accountId}') was found`);
      }

      // load records from provider account
      const records = await this.getRecordsFromMonobankAccount(
        account,
        DateTime.fromISO(job.data.fromDate),
        DateTime.fromISO(job.data.toDate),
      );

      this.debug(job, `received ${records.length} records`);

      // filter already existing records
      const recordBankIds = records.map((record) => record.bankRecordId);

      const existingRecords = await this.recordsRepository.find({
        where: {
          bankRecordId: In(recordBankIds),
        },
      });
      const existingRecordBankIds = existingRecords.map((record) => record.bankRecordId);

      this.debug(job, `${existingRecordBankIds.length} of ${records.length} records already exist`);

      // find records to save
      let recordsToSave = records.filter((record) => !existingRecordBankIds.includes(record.bankRecordId));

      if (recordsToSave.length) {
        // assign categories
        const categories = await this.getCategories(account.createdBy);
        recordsToSave = this.categoryAssignerService.assignCategories(recordsToSave, categories);
        // assign to company
        recordsToSave = this.companyAssignerService.assignCompanies(recordsToSave);
        // assign current currency rates
        const rates = await this.currencyRatesService.getCurrencies();
        recordsToSave.forEach((record) => {
          record.currenciesMetadata = rates;
        });

        const savedRecords = await this.recordsRepository.save(recordsToSave);

        this.debug(job, `saved ${savedRecords.length} records for account '${job.data.accountId}'`);
      } else {
        this.debug(job, `records for account '${job.data.accountId}' are up to date`);
      }
    } catch (error) {
      this.error(job, `failed to process job for account '${job.data.accountId}'`);

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
        .pipe(map((r) => r.data)),
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
    record.creationType = RecordCreationTypeEnum.Synced;
    record.currencyCode = account.currencyCode;
    record.operationCurrencyCode = statement.currencyCode;
    record.description = statement.description;
    record.mcc = statement.mcc;
    record.metadata = statement;
    record.createdBy = account.createdBy;

    return record;
  }

  private getCategories(userId: string): Promise<CategoryEntity[]> {
    return this.categoriesRepository.find({
      where: {
        createdBy: In([userId, 'SYSTEM']),
      },
      relations: {
        parentCategory: true,
        merchantCategoryCodes: true,
      },
    });
  }

  private debug(job: Job, message: string, ...other): void {
    this.logger.debug(`${job.id}: ${message}`, ...other);
  }

  private error(job: Job, message: string, ...other): void {
    this.logger.error(`${job.id}: ${message}`, ...other);
  }
}
