import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountModel } from '../../api/accounts/models/account.model';
import { SummaryModel } from '../../api/analytics/models/summary.model';
import { ApiAnalyticsService } from '../../api/analytics/services/api-analytics.service';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private apiAnalyticsService = inject(ApiAnalyticsService);

  getSummary$(fromDate: Date, toDate: Date, accounts: AccountModel[]): Observable<SummaryModel> {
    return this.apiAnalyticsService.extractSummary$(fromDate, toDate, accounts);
  }
}
