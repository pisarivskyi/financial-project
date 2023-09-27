import { CategoryInterface } from '@financial-project/common';

import { BaseModel } from '../../../core/models/base.model';

export class CategoryModel extends BaseModel implements CategoryInterface {
  name!: string;
  color!: string;
  icon!: string;
  mccRangeEnd!: number;
  mccRangeStart!: number;
  parentCategory!: CategoryModel;
  createdBy!: string;
}
