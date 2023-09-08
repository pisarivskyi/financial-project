import { CurrencyEnum, RecordCreationTypeEnum, RecordTypeEnum } from '../enums';
import { AccountInterface } from './account.interface';
import { CategoryInterface } from './category.interface';

export interface RecordInterface {
  bankRecordId?: string;
  bankCreatedAt?: Date;
  name: string;
  comment: string;
  amount: number;
  type: RecordTypeEnum;
  account: AccountInterface;
  balance?: number;
  category?: CategoryInterface;
  creationType: RecordCreationTypeEnum;
  currencyCode: CurrencyEnum;
  description: string;
  mcc?: number;
  metadata?: object;
  createdBy: string;
}
