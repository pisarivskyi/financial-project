import { BudgetPlanInterface, OmitFields } from '@financial-project/common';

export type InsertBudgetPlanDataType = OmitFields<
  Omit<BudgetPlanInterface, 'plannedPaymentSnapshots' | 'budgetSnapshots'> & {
    plannedPaymentSnapshotIds: string[];
    budgetSnapshotIds: string[];
  }
>;
