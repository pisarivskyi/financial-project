import { OmitType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PlannedPaymentEntity } from '../entities/planned-payment.entity';

export class CreatePlannedPaymentDto extends OmitType(PlannedPaymentEntity, [
  'id',
  'createdAt',
  'updatedAt',
  'createdBy',
  'category',
]) {
  @IsOptional()
  @IsString()
  categoryId?: string;
}
