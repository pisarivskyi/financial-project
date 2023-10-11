import { Expose } from 'class-transformer';

import { CurrencyEnum, SettingsInterface } from '@financial-project/common';

import { BaseModel } from '../../../core/models/base.model';

export class SettingsModel extends BaseModel implements SettingsInterface {
  @Expose()
  billingPeriodStartDayNumber!: number;

  @Expose()
  createdBy!: string;

  @Expose()
  defaultCurrencyCode!: CurrencyEnum;
}
