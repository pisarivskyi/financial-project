import { IsString } from 'class-validator';

import { CreatePlannedPaymentDto } from '../../planned-payments/dto/create-planned-payment.dto';

export class CreatePlannedPaymentSnapshotDto extends CreatePlannedPaymentDto {
  @IsString()
  id: string;
}
