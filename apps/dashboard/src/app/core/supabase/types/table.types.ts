import { Database } from './database.types';

export type Public = Database['public'];

export type PublicTables = Public['Tables'];

// Records table
export type RecordsTable = PublicTables['records'];
export type ApiGetRecordRowData = Omit<RecordsTable['Row'], 'category'> & {
  category: ApiGetCategoryRowData;
};
export type ApiInsertRecordRowData = RecordsTable['Insert'];
export type ApiUpdateRecordRowData = RecordsTable['Update'];

// Categories table
export type CategoriesTable = PublicTables['categories'];
export type ApiGetCategoryRowData = CategoriesTable['Row'];
export type ApiInsertCategoryRowData = CategoriesTable['Insert'];
export type ApiUpdateCategoryRowData = CategoriesTable['Update'];

// Budgets table
export type BudgetsTable = PublicTables['budgets'];
export type ApiGetBudgetRowData = BudgetsTable['Row'];

