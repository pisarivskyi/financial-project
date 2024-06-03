import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiMonobank } from '@financial-project/providers';

import { HttpMethodEnum } from '../../../core/communication/enums/http-method.enum';
import { CommunicationService } from '../../../core/communication/services/communication.service';
import { CurrencyRateModel } from '../models/currency-rate.model';
import { ApiCurrencyRatesTransformService } from './api-currency-rates-transform.service';

@Injectable({
  providedIn: 'root',
})
export class ApiCurrencyRatesService {
  readonly requests = {
    currencyRates: '/currency-rates',
  };

  constructor(
    private apiCurrencyRatesTransformService: ApiCurrencyRatesTransformService,
    private communicationService: CommunicationService,
  ) {}

  extractCurrencyRates$(): Observable<CurrencyRateModel[]> {
    return this.communicationService
      .makeRequest<ApiMonobank.Currencies.ResponseType>({
        method: HttpMethodEnum.Get,
        path: this.requests.currencyRates,
      })
      .pipe(map((response) => this.apiCurrencyRatesTransformService.fromExtractCurrencyRates(response)));
  }
}
