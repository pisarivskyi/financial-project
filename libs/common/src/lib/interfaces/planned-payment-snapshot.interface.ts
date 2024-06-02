import { BudgetPlanInterface } from './budget-plan.interface';
import { PlannedPaymentInterface } from './planned-payment.interface';

export interface PlannedPaymentSnapshotInterface extends PlannedPaymentInterface {
  original: PlannedPaymentInterface;
  budgetPlan: BudgetPlanInterface;
}
