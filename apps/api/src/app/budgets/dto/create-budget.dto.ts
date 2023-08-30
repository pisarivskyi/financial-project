import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

import { BudgetEntity } from '../entities/budget.entity';

export class CreateBudgetDto extends OmitType(BudgetEntity, [
  'id',
  'createdAt',
  'updatedAt',
  'createdBy',
  'categories',
]) {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  categoryIds: string[];
}
