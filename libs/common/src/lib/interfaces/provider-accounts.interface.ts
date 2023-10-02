import { CurrencyEnum, ProviderTypeEnum } from '../enums';

export interface ProviderAccountDataInterface {
  id: string;
  maskedPan: string;
  currencyCode: CurrencyEnum;
  balance: number;
  creditLimit: number;
}

export interface ProviderAccountsInterface {
  clientId: string;
  providerId: string;
  providerType: ProviderTypeEnum;
  accounts: ProviderAccountDataInterface[];
  originalData?: any;
}
