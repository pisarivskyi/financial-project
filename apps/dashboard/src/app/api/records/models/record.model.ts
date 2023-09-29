import { Expose, Type } from 'class-transformer';

import {
  AccountInterface,
  CurrencyEnum,
  RecordCreationTypeEnum,
  RecordInterface,
  RecordTypeEnum,
} from '@financial-project/common';

import { BaseModel } from '../../../core/models/base.model';
import { CategoryModel } from '../../categories/models/category.model';

export class RecordModel extends BaseModel implements RecordInterface {
  @Expose()
  name!: string;

  @Expose()
  amount!: number;

  @Expose()
  @Type(() => CategoryModel)
  category?: CategoryModel;

  @Expose()
  createdBy!: string;

  @Expose()
  currencyCode!: CurrencyEnum;

  @Expose()
  account!: AccountInterface;

  @Expose()
  balance?: number;

  @Expose()
  @Type(() => Date)
  bankCreatedAt?: Date;

  @Expose()
  bankRecordId?: string;

  @Expose()
  comment!: string;

  @Expose()
  creationType!: RecordCreationTypeEnum;

  @Expose()
  description!: string;

  @Expose()
  mcc?: number;

  @Expose()
  metadata?: object;

  @Expose()
  type!: RecordTypeEnum;
}
