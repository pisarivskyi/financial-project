import { Type } from 'class-transformer';

import { BudgetPlanInterface } from '@financial-project/common';

import { BudgetSnapshotModel } from '../../budget-snapshots/models/budget-snapshot.model';
import { PlannedPaymentSnapshotModel } from '../../planned-payment-snapshots/models/planned-payment-snapshot.model';
import { BaseModel } from '../../shared/models/base.model';

export class BudgetPlanModel extends BaseModel implements BudgetPlanInterface {
  year!: number;
  month!: number;
  @Type(() => BudgetSnapshotModel)
  budgetSnapshots!: BudgetSnapshotModel[];
  @Type(() => PlannedPaymentSnapshotModel)
  plannedPaymentSnapshots!: PlannedPaymentSnapshotModel[];
  createdBy!: string;
}
