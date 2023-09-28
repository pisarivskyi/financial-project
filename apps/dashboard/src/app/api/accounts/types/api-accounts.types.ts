import { AccountInterface, OmitFields } from '@financial-project/common';

export type InsertAccountDataType = OmitFields<AccountInterface>;

export type UpdateCategoryDataType = Partial<InsertAccountDataType>;
