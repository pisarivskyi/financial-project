import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { SummaryInterface } from '@financial-project/common';

import { HttpMethodEnum } from '../../../core/communication/enums/http-method.enum';
import { CommunicationService } from '../../../core/communication/services/communication.service';
import { AccountModel } from '../../accounts/models/account.model';
import { SummaryModel } from '../models/summary.model';
import { ApiAnalyticsTransformService } from './api-analytics-transform.service';

@Injectable({
  providedIn: 'root',
})
export class ApiAnalyticsService {
  readonly requests = {
    getSummary: '/analytics/summary',
  };

  constructor(
    private apiSettingsTransformService: ApiAnalyticsTransformService,
    private communicationService: CommunicationService
  ) {}

  extractSummary$(fromDate: Date, toDate: Date, accounts: AccountModel[]): Observable<SummaryModel> {
    return this.communicationService
      .makeRequest<SummaryInterface>({
        method: HttpMethodEnum.Post,
        path: this.requests.getSummary,
        payload: this.apiSettingsTransformService.toUpdateSettings(fromDate, toDate, accounts),
      })
      .pipe(map((response) => this.apiSettingsTransformService.fromExtractSummary(response)));
  }
}
