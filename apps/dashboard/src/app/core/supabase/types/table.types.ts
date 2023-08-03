import { Database } from './database.types';
import { DatabaseTableEnum } from '../enums/database-table.enum';

export type Public = Database['public'];

export type PublicTables = Public['Tables'];

// Records table
export type RecordsTable = PublicTables[DatabaseTableEnum.Records];
export type ApiGetRecordRowData = Omit<RecordsTable['Row'], 'category'> & {
  category: ApiGetCategoryRowData;
};
export type ApiInsertRecordRowData = RecordsTable['Insert'];
export type ApiUpdateRecordRowData = RecordsTable['Update'];

// Categories table
export type CategoriesTable = PublicTables[DatabaseTableEnum.Categories];
export type ApiGetCategoryRowData = CategoriesTable['Row'];
export type ApiInsertCategoryRowData = CategoriesTable['Insert'];
export type ApiUpdateCategoryRowData = CategoriesTable['Update'];

// Accounts table
export type AccountsTable = PublicTables[DatabaseTableEnum.Accounts];
export type ApiGetAccountRowData = AccountsTable['Row'];
export type ApiInsertAccountRowData = AccountsTable['Insert'];
export type ApiUpdateAccountRowData = AccountsTable['Update'];

// Budgets table
export type BudgetsTable = PublicTables[DatabaseTableEnum.Budgets];
export type ApiGetBudgetRowData = BudgetsTable['Row'];
export type ApiInsertBudgetRowData = BudgetsTable['Insert'];
export type ApiUpdateBudgetRowData = BudgetsTable['Update'];

