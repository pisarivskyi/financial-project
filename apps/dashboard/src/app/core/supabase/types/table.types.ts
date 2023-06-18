import { Database } from './database.types';

export type Public = Database['public'];

export type PublicTables = Public['Tables'];

// Expanse table
export type ExpansesTable = PublicTables['expanses'];
export type ApiGetExpanseRowData = Omit<ExpansesTable['Row'], 'category'> & {
  category: ApiGetExpanseCategoryRowData;
};
export type ApiInsertExpanseRowData = ExpansesTable['Insert'];
export type ApiUpdateExpanseRowData = ExpansesTable['Update'];

// Expanse categories table
export type ExpanseCategoriesTable = PublicTables['expanse_categories'];
export type ApiGetExpanseCategoryRowData = ExpanseCategoriesTable['Row'];
export type ApiInsertExpanseCategoryRowData = ExpanseCategoriesTable['Insert'];

// Budgets table
export type BudgetsTable = PublicTables['budgets'];
export type ApiGetBudgetRowData = BudgetsTable['Row'];

// Income table
export type IncomesTable = PublicTables['incomes'];
export type ApiGetIncomeRowData = IncomesTable['Row'];
