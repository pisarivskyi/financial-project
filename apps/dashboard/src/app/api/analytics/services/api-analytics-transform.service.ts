import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';

import { SummaryInterface } from '@financial-project/common';

import { AccountModel } from '../../accounts/models/account.model';
import { SummaryModel } from '../models/summary.model';
import { GetSummaryDataType } from '../types/api-analytics.types';

@Injectable({
  providedIn: 'root',
})
export class ApiAnalyticsTransformService {
  fromExtractSummary(response: SummaryInterface): SummaryModel {
    return this.toSummaryModel(response);
  }

  toUpdateSettings(fromDate: Date, toDate: Date, accounts: AccountModel[]): GetSummaryDataType {
    return {
      fromDate,
      toDate,
      accountIds: accounts.map((account) => account.id),
    };
  }

  private toSummaryModel(plain: SummaryInterface): SummaryModel {
    return plainToInstance(SummaryModel, plain);
  }
}
