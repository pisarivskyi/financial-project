import { BudgetInterface, OmitFields } from '@financial-project/common';

export type InsertBudgetDataType = OmitFields<Omit<BudgetInterface, 'categories'>> & {
  categoryIds: string[];
};

export type UpdateBudgetDataType = Partial<InsertBudgetDataType>;
