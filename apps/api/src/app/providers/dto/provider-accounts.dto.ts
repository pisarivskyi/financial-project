import { CurrencyEnum, ProviderAccountsInterface, ProviderTypeEnum } from '@financial-project/common';

export class ProviderAccountsDto implements ProviderAccountsInterface {
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
