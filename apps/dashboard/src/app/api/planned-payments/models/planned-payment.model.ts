import { Expose, Type } from 'class-transformer';

import { CurrencyEnum, PeriodEnum, PlannedPaymentInterface, RecordTypeEnum } from '@financial-project/common';

import { CategoryModel } from '../../categories/models/category.model';
import { BaseModel } from '../../shared/models/base.model';

export class PlannedPaymentModel extends BaseModel implements PlannedPaymentInterface {
  @Expose()
  name!: string;

  @Expose()
  amount!: number;

  @Expose()
  currencyCode!: CurrencyEnum;

  @Expose()
  period!: PeriodEnum;

  @Expose()
  @Type(() => CategoryModel)
  category!: CategoryModel;

  @Expose()
  @Type(() => Date)
  dateOfYear?: Date;

  @Expose()
  dayOfMonth?: number;

  @Expose()
  dayOfWeek?: number;

  @Expose()
  icon!: string;

  @Expose()
  type!: RecordTypeEnum;

  @Expose()
  color?: string;

  @Expose()
  createdBy!: string;
}
