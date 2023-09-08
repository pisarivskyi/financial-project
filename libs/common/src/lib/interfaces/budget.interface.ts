import { CurrencyEnum, PeriodEnum } from '../enums';
import { CategoryInterface } from './category.interface';

export interface BudgetInterface {
  name: string;
  amount: number;
  categories: CategoryInterface[];
  color?: string;
  currencyCode: CurrencyEnum;
  period: PeriodEnum;
  fromDate?: Date;
  toDate?: Date;
  createdBy: string;
}
