import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsOptional } from 'class-validator';

import { BudgetEntity } from '../entities/budget.entity';

export class CreateBudgetDto extends OmitType(BudgetEntity, [
  'id',
  'createdAt',
  'updatedAt',
  'createdBy',
  'categories',
  'fromDate',
  'toDate',
]) {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  categoryIds: string[];

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fromDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  toDate?: Date;
}
