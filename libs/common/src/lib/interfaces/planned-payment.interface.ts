import { CurrencyEnum } from '../enums/currency.enum';
import { PeriodEnum } from '../enums/period.enum';
import { RecordTypeEnum } from '../enums/record-type.enum';
import { CategoryInterface } from './category.interface';

export interface PlannedPaymentInterface {
  name: string;
  category: CategoryInterface;
  amount: number;
  type: RecordTypeEnum;
  currencyCode: CurrencyEnum;
  period: PeriodEnum;
  dayOfWeek?: number; // for weekly
  dayOfMonth?: number; // for monthly
  dateOfYear?: Date; // for one-time and yearly
}
