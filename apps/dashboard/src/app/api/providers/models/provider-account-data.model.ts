import { CurrencyEnum, ProviderAccountDataInterface } from '@financial-project/common';

export class ProviderAccountDataModel implements ProviderAccountDataInterface {
  id!: string;
  maskedPan!: string;
  currencyCode!: CurrencyEnum;
  balance!: number;
  creditLimit!: number;
}
