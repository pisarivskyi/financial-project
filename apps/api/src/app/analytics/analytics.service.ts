import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Between, In, Repository } from 'typeorm';

import { RecordTypeEnum, UserInterface } from '@financial-project/common';

import { AccountEntity } from '../accounts/entities/account.entity';
import { RecordEntity } from '../records/entities/record.entity';
import { SettingsEntity } from '../settings/entities/settings.entity';
import { GetSummaryDto } from './dto/get-summary.dto';
import { SummaryDto } from './dto/summary.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(SettingsEntity) private settingsRepository: Repository<SettingsEntity>,
    @InjectRepository(RecordEntity) private recordsRepository: Repository<RecordEntity>,
    @InjectRepository(AccountEntity) private accountsRepository: Repository<AccountEntity>
  ) {}

  async getSummaryAnalytics(params: GetSummaryDto, user: UserInterface): Promise<SummaryDto> {
    const { fromDate, toDate, accountIds } = params;

    const accounts = await this.accountsRepository.find({
      where: {
        id: In(accountIds),
        createdBy: user.sub,
      },
    });

    const records = await this.recordsRepository.find({
      where: {
        account: {
          id: In(accounts.map((account) => account.id)),
        },
        createdBy: user.sub,
        bankCreatedAt: Between(fromDate, toDate),
      },
      order: {
        bankCreatedAt: 'DESC',
      },
      relations: {
        category: true,
      },
    });

    const outcomeRecords = records.filter((record) => record.type === RecordTypeEnum.Outcome);
    const incomeRecords = records.filter((record) => record.type === RecordTypeEnum.Income);

    return plainToInstance(SummaryDto, {
      fromDate,
      toDate,
      income: incomeRecords.reduce((acc, item) => acc + item.amount, 0),
      outcome: outcomeRecords.reduce((acc, item) => acc + item.amount, 0),
      incomeRecordsCount: incomeRecords.length,
      outcomeRecordsCount: outcomeRecords.length,
      recordsCount: records.length,
      outcomeRecords: outcomeRecords,
      incomeRecords: incomeRecords,
    });
  }
}
