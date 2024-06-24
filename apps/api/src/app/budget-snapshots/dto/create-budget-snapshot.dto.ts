import { IsString } from 'class-validator';

import { CreateBudgetDto } from '../../budgets/dto/create-budget.dto';

export class CreateBudgetSnapshotDto extends CreateBudgetDto {
  @IsString()
  id: string;
}
