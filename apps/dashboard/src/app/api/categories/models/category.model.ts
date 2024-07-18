import { Type } from 'class-transformer';

import { CategoryInterface } from '@financial-project/common';

import { BaseModel } from '../../shared/models/base.model';

export class CategoryModel extends BaseModel implements CategoryInterface {
  name!: string;
  color!: string;
  icon!: string;
  @Type(() => CategoryModel)
  parentCategory?: CategoryModel;
  createdBy!: string;
}
