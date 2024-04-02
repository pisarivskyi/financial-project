import { Expose, Type } from 'class-transformer';

import { CurrencyEnum, PeriodEnum, PlannedPaymentInterface, RecordTypeEnum } from '@financial-project/common';

import { BaseModel } from '../../../core/models/base.model';
import { CategoryModel } from '../../categories/models/category.model';

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
