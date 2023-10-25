import { MerchantCategoryCodeInterface } from './merchant-category-code.interface';

export interface CategoryInterface {
  id: string;
  name: string;
  color: string;
  icon: string;
  parentCategory?: CategoryInterface;
  merchantCategoryCodes?: MerchantCategoryCodeInterface[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
