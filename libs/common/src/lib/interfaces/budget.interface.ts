import { CurrencyEnum, PeriodEnum } from '../enums';
import { UserInterface } from './user.interface';

export interface BudgetInterface {
  name: string;
  amount: number;
  color?: string;
  currencyCode: CurrencyEnum;
  period: PeriodEnum;
  fromDate: Date;
  toDate: Date;
  createdBy: UserInterface;
}
