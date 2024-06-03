import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom, map, of, tap } from 'rxjs';

import { CurrencyEnum } from '@financial-project/common';
import { ApiMonobank, ApiMonobankProviderService } from '@financial-project/providers';

@Injectable()
export class CurrencyRatesService {
  private cached: ApiMonobank.Currencies.ResponseType = [];
  private lastTimeUpdated: Date | null = null;
  private ttl = 300000; // 5 minutes

  private readonly allowedCurrencies = [CurrencyEnum.USD, CurrencyEnum.UAH, CurrencyEnum.EUR];

  constructor(private readonly api: ApiMonobankProviderService) {}

  getCurrencies(): Promise<ApiMonobank.Currencies.ResponseType> {
    if (this.cached.length && Date.now() - this.lastTimeUpdated?.getTime() < this.ttl) {
      return Promise.resolve(this.cached);
    }

    this.lastTimeUpdated = new Date();

    return firstValueFrom(
      this.api.getCurrencies$().pipe(
        map((resp) => resp.data),
        map((data) =>
          data.filter(
            (currency) =>
              this.allowedCurrencies.includes(currency.currencyCodeA) &&
              this.allowedCurrencies.includes(currency.currencyCodeB),
          ),
        ),
        tap((currencies) => (this.cached = currencies)),
        catchError(() => of([])),
      ),
    );
  }
}
