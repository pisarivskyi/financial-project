import { BudgetPlanInterface } from './budget-plan.interface';
import { BudgetInterface } from './budget.interface';

export interface BudgetSnapshotInterface extends BudgetInterface {
  original: BudgetInterface;
  budgetPlan: BudgetPlanInterface;
}
