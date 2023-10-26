import { CategoryInterface } from './category.interface';

export interface MerchantCategoryCodeInterface {
  name: string;
  description: string;
  code: number;
  createdBy: string;
  categories: CategoryInterface[];
}
