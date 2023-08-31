import { CurrencyEnum, ProviderTypeEnum } from '@financial-project/common';

export class ProviderAccountsDto {
  clientId: string;
  providerId: string;
  providerType: ProviderTypeEnum;
  accounts: {
    id: string;
    maskedPan: string;
    currencyCode: CurrencyEnum;
    balance: number;
    creditLimit: number;
  }[];
  originalData?: any;
}
