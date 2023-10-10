import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import { plainToClassFromExist } from 'class-transformer';
import { firstValueFrom, map } from 'rxjs';
import { Repository } from 'typeorm';

import { ApiMonobank, ApiMonobankProviderService } from '@financial-project/providers';

import { AccountEntity } from '../../accounts/entities/account.entity';
import { RecordEntity } from '../../records/entities/record.entity';
import { ACCOUNT_SYNC_QUEUE_NAME } from '../constants/account-sync-queue-name.const';
import { JobPayloadInterface } from '../interfaces/job-payload.interface';

@Processor(ACCOUNT_SYNC_QUEUE_NAME)
export class AccountSynchronizationProcessorService extends WorkerHost {
  private readonly logger = new Logger(AccountSynchronizationProcessorService.name);

  constructor(
    @InjectRepository(AccountEntity) private accountsRepository: Repository<AccountEntity>,
    @InjectRepository(RecordEntity) private recordsRepository: Repository<RecordEntity>,
    private apiMonobankProviderService: ApiMonobankProviderService
  ) {
    super();
  }

  async process(job: Job<JobPayloadInterface>): Promise<void> {
    this.logger.debug(`received job for account '${job.data.accountId}'`);

    try {
      const account = await this.getAccount(job.data.accountId);

      if (!account) {
        throw new Error(`No account with such id ('${job.data.accountId}') was found`);
      }

      // updating account itself
      const monoAccount = await this.getMonobankAccount(account.bankAccountId, account.provider.data.token);

      const updatedAccount = plainToClassFromExist(account, {
        balance: monoAccount.balance,
        creditLimit: monoAccount.creditLimit,
        lastSyncDate: new Date(),
      });

      await this.accountsRepository.update(updatedAccount.id, updatedAccount);
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

  private getMonobankAccount(bankAccountId: string, token: string): Promise<ApiMonobank.ClientInfo.AccountInterface> {
    return firstValueFrom(
      this.apiMonobankProviderService
        .getClientInfo$(token)
        .pipe(map((r) => r.data.accounts.find((monoAccount) => monoAccount.id === bankAccountId)))
    );
  }
}
