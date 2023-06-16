import { Database } from './database.types';

export type Public = Database['public'];

export type PublicTables = Public['Tables'];

export type ExpansesTable = PublicTables['expanses'];
export type ApiGetExpanseRowData = ExpansesTable['Row'];

export type ExpanseCategoriesTable = PublicTables['expanse_categories'];
export type ApiGetExpanseCategoryRowData = ExpanseCategoriesTable['Row'];

export type BudgetsTable = PublicTables['budgets'];
export type ApiGetBudgetRowData = BudgetsTable['Row'];

export type IncomesTable = PublicTables['incomes'];
export type ApiGetIncomeRowData = IncomesTable['Row'];

