import { Expose, Type } from 'class-transformer';

import { BudgetInterface, CurrencyEnum, PeriodEnum } from '@financial-project/common';

import { BaseModel } from '../../../core/models/base.model';
import { CategoryModel } from '../../categories/models/category.model';

export class BudgetModel extends BaseModel implements BudgetInterface {
  @Expose()
  name!: string;

  @Expose()
  amount!: number;

  @Expose()
  currencyCode!: CurrencyEnum;

  @Expose()
  @Type(() => CategoryModel)
  categories!: CategoryModel[];

  @Expose()
  color?: string;

  @Expose()
  createdBy!: string;

  @Expose()
  period!: PeriodEnum;

  @Expose()
  @Type(() => Date)
  fromDate?: Date;

  @Expose()
  @Type(() => Date)
  toDate?: Date;
}
