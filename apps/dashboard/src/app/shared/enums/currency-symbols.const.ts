import { CurrencyEnum } from '@financial-project/common';

// according to https://en.wikipedia.org/wiki/Currency_symbol
export const CurrencySymbolsConst: Record<CurrencyEnum, string> = {
  [CurrencyEnum.UAH]: '₴',
  [CurrencyEnum.USD]: '$',
  [CurrencyEnum.EUR]: '€',
  [CurrencyEnum.HRK]: 'kn',
  [CurrencyEnum.CZK]: 'Kč',
  [CurrencyEnum.PLN]: 'zł',
  [CurrencyEnum.RUB]: '₽',
};
