import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';

import { ApiMonobank } from '@financial-project/providers';

import { CurrencyRateModel } from '../models/currency-rate.model';

@Injectable({
  providedIn: 'root',
})
export class ApiCurrencyRatesTransformService {
  fromExtractCurrencyRates(response: ApiMonobank.Currencies.ResponseType): CurrencyRateModel[] {
    return response.map((r) => this.toCurrencyRateModel(r));
  }

  private toCurrencyRateModel(plain: ApiMonobank.Currencies.CurrencyInterface): CurrencyRateModel {
    return plainToInstance(CurrencyRateModel, plain);
  }
}
