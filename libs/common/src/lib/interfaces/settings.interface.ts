import { CurrencyEnum } from '../enums';
import { UserInterface } from './user.interface';

export interface SettingsInterface {
  billingPeriodStartDayNumber: number;
  createdBy: UserInterface;
  defaultCurrencyCode: CurrencyEnum;
}
