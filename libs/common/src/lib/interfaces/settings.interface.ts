import { CurrencyEnum } from '../enums';

export interface SettingsInterface {
  id: string;
  billingPeriodStartDayNumber: number;
  createdBy: string;
  defaultCurrencyCode: CurrencyEnum;
  updatedAt: Date;
  createdAt: Date;
}
