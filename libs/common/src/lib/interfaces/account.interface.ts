import { AccountType, CurrencyEnum, ProviderEnum } from '../enums';

export interface AccountInterface {
  name: string;
  type: AccountType;
  balance: number;
  bankSpecificType?: string;
  color?: string;
  currencyCode: CurrencyEnum;
  metadata?: JSON;
  provider: ProviderEnum;
}
