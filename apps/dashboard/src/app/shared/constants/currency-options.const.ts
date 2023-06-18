import { CurrencyEnum } from '../enums/currency.enum';

export const CURRENCY_OPTIONS = [
  {
    label: CurrencyEnum[CurrencyEnum.EUR],
    value: CurrencyEnum.EUR,
  },
  {
    label: CurrencyEnum[CurrencyEnum.USD],
    value: CurrencyEnum.USD,
  },
  {
    label: CurrencyEnum[CurrencyEnum.UAH],
    value: CurrencyEnum.UAH,
  },
];
