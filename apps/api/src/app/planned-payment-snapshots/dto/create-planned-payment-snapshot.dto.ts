import { IsString } from 'class-validator';

export class CreatePlannedPaymentSnapshotDto {
  @IsString()
  originalId: string;
}
