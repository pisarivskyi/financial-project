import { CategoryInterface } from '@financial-project/common';

import { BaseModel } from '../../../core/models/base.model';
import { Type } from 'class-transformer';

export class CategoryModel extends BaseModel implements CategoryInterface {
  name!: string;
  color!: string;
  icon!: string;
  mccRangeEnd!: number;
  mccRangeStart!: number;
  @Type(() => CategoryModel)
  parentCategory!: CategoryModel;
  createdBy!: string;
}
