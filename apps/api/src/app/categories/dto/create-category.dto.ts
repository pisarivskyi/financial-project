import { OmitType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { CategoryEntity } from '../entities/category.entity';

export class CreateCategoryDto extends OmitType(CategoryEntity, [
  'id',
  'createdAt',
  'updatedAt',
  'createdBy',
  'parentCategory',
  'merchantCategoryCodes',
]) {
  @IsOptional()
  @IsString()
  parentCategory?: string;
}
