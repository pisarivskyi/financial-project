import { BudgetSnapshotInterface } from './budget-snapshot.interface';
import { PlannedPaymentSnapshotInterface } from './planned-payment-snapshot.interface';

export interface BudgetPlanInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  month: number;
  year: number;
  plannedPaymentSnapshots: PlannedPaymentSnapshotInterface[];
  budgetSnapshots: BudgetSnapshotInterface[];
  createdBy: string;
}
