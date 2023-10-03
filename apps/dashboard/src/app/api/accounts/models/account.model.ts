import { Expose, Type } from 'class-transformer';

import {
  AccountInterface,
  AccountTypeEnum,
  CurrencyEnum,
  IssuerEnum,
  ProviderInterface,
  ProviderTypeEnum,
} from '@financial-project/common';

import { BaseModel } from '../../../core/models/base.model';

export class AccountModel extends BaseModel implements AccountInterface {
  @Expose()
  name!: string;

  @Expose()
  balance!: number;

  @Expose()
  createdBy!: string;

  @Expose()
  type!: AccountTypeEnum;

  @Expose()
  provider!: ProviderInterface;

  @Expose()
  currencyCode!: CurrencyEnum;

  @Expose()
  bankSpecificType?: string;

  @Expose()
  color?: string;

  @Expose()
  metadata!: object;

  @Expose()
  bankAccountId!: string;

  @Expose()
  @Type(() => Date)
  lastSyncDate!: Date;

  @Expose()
  maskedPan!: string;

  @Expose()
  providerType!: ProviderTypeEnum;

  @Expose()
  issuer!: IssuerEnum;
}
