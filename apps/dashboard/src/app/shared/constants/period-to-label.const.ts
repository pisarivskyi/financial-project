import { PeriodEnum } from '@financial-project/common';

export const PERIOD_TO_LABEL: Record<PeriodEnum, string> = {
  [PeriodEnum.OneTime]: 'One time',
  [PeriodEnum.Monthly]: 'Monthly',
  [PeriodEnum.Weekly]: 'Weekly',
  [PeriodEnum.Yearly]: 'Yearly',
};
