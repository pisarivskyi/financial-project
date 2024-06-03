import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';

import { CurrencyEnum } from '@financial-project/common';

import { CurrencyRateModel } from '../../api/currency-rates/models/currency-rate.model';
import { ApiCurrencyRatesService } from '../../api/currency-rates/services/api-currency-rates.service';

@Injectable({
  providedIn: 'root',
})
export class CurrencyRatesService {
  private currenciesRates$ = new BehaviorSubject<CurrencyRateModel[]>([]);

  private apiSettingsService = inject(ApiCurrencyRatesService);

  getCurrencyRates$(): Observable<CurrencyRateModel[]> {
    return this.apiSettingsService.extractCurrencyRates$().pipe(tap((rates) => this.currenciesRates$.next(rates)));
  }

  getCurrencyRatesSync(): CurrencyRateModel[] {
    return this.currenciesRates$.value;
  }

  getCurrencyRatesFromCache$(): Observable<CurrencyRateModel[]> {
    if (this.currenciesRates$.value) {
      return this.currenciesRates$.asObservable().pipe(take(1));
    }

    return this.getCurrencyRates$();
  }

  convert(
    amount: number,
    fromCurrency: CurrencyEnum,
    toCurrency: CurrencyEnum,
    currencyRates?: CurrencyRateModel[],
  ): number {
    const currencyRate = (currencyRates ?? this.getCurrencyRatesSync()).find((rate) => {
      return (
        (rate.currencyCodeA === fromCurrency && rate.currencyCodeB === toCurrency) ||
        (rate.currencyCodeA === toCurrency && rate.currencyCodeB === fromCurrency)
      );
    });

    if (currencyRate) {
      if (currencyRate.currencyCodeA === fromCurrency) {
        return amount / currencyRate.rateBuy;
      } else if (currencyRate.currencyCodeB === fromCurrency) {
        return amount / currencyRate.rateSell;
      }
    }

    return amount;
  }
}
