import { Expose } from 'class-transformer';

import { CurrencyEnum } from '@financial-project/common';
import { ApiMonobank } from '@financial-project/providers';

export class CurrencyRateModel implements ApiMonobank.Currencies.CurrencyInterface {
  @Expose()
  currencyCodeA!: CurrencyEnum;

  @Expose()
  currencyCodeB!: CurrencyEnum;

  @Expose()
  date!: number;

  @Expose()
  rateBuy!: number;

  @Expose()
  rateSell!: number;
}
