import { Expose } from 'class-transformer';

import { BudgetSnapshotInterface } from '@financial-project/common';

import { BudgetPlanModel } from '../../budget-plans/models/budget-plan.model';
import { BudgetModel } from '../../budgets/models/budget.model';

export class BudgetSnapshotModel extends BudgetModel implements BudgetSnapshotInterface {
  @Expose()
  original!: BudgetModel;

  @Expose()
  budgetPlan!: BudgetPlanModel;
}
