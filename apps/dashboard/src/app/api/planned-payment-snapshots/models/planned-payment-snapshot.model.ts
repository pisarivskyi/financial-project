import { Expose } from 'class-transformer';

import { PlannedPaymentSnapshotInterface } from '@financial-project/common';

import { BudgetPlanModel } from '../../budget-plans/models/budget-plan.model';
import { PlannedPaymentModel } from '../../planned-payments/models/planned-payment.model';

export class PlannedPaymentSnapshotModel extends PlannedPaymentModel implements PlannedPaymentSnapshotInterface {
  @Expose()
  original!: PlannedPaymentModel;

  @Expose()
  budgetPlan!: BudgetPlanModel;
}
