import { IsString } from 'class-validator';

export class CreateBudgetSnapshotDto {
  @IsString()
  originalId: string;
}
