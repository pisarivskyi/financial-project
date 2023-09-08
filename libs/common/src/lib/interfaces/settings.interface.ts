import { CurrencyEnum } from '../enums';

export interface SettingsInterface {
  billingPeriodStartDayNumber: number;
  createdBy: string;
  defaultCurrencyCode: CurrencyEnum;
}
