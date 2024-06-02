import { IsArray, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateBudgetPlanDto {
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @IsNumber()
  year: number;

  @IsArray()
  @IsString({ each: true })
  budgetSnapshotIds: string[];

  @IsArray()
  @IsString({ each: true })
  plannedPaymentSnapshotIds: string[];
}
