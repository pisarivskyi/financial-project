import { CategoryInterface, OmitFields } from '@financial-project/common';

export type InsertCategoryDataType = OmitFields<Omit<CategoryInterface, 'parentCategory'>> & {
  parentCategory?: string;
};

export type UpdateCategoryDataType = Partial<InsertCategoryDataType>;
