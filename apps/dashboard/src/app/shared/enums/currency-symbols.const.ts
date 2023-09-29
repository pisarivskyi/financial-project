import { CurrencyEnum } from '@financial-project/common';

export const CurrencySymbolsConst: Record<CurrencyEnum, string> = {
  [CurrencyEnum.UAH]: '₴',
  [CurrencyEnum.USD]: '$',
  [CurrencyEnum.EUR]: '€',
};
