import { InsertBudgetDataType } from '../../budgets/types/api-budgets.types';

export type InsertBudgetSnapshotDataType = InsertBudgetDataType & {
  id: string;
};
