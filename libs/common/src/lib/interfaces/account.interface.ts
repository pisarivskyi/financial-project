import { AccountTypeEnum, CurrencyEnum, ProviderTypeEnum } from '../enums';
import { ProviderInterface } from './provider.interface';

export interface AccountInterface {
  id: string;
  bankAccountId?: string;
  name: string;
  type: AccountTypeEnum;
  balance: number;
  maskedPan?: string;
  bankSpecificType?: string;
  color?: string;
  currencyCode: CurrencyEnum;
  metadata?: object;
  provider?: ProviderInterface;
  providerType: ProviderTypeEnum;
  lastSyncDate?: Date;
  createdBy: string;
  updatedAt: Date;
  createdAt: Date;
}
