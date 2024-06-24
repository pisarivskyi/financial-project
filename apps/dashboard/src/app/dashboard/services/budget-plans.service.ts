import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BudgetPlanModel } from '../../api/budget-plans/models/budget-plan.model';
import { ApiBudgetPlansService } from '../../api/budget-plans/services/api-budget-plans.service';
import { PaginatedResponse } from '../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../core/pagination/interfaces/pagination-params.interface';

@Injectable({
  providedIn: 'root',
})
export class BudgetPlansService {
  constructor(private apiBudgetPlansService: ApiBudgetPlansService) {}

  getBudgetPlans$(pagination?: PaginationParamsInterface): Observable<PaginatedResponse<BudgetPlanModel>> {
    return this.apiBudgetPlansService.extractBudgetPlans$(pagination);
  }

  saveBudgetPlan$(budgetPlanToSave: BudgetPlanModel): Observable<BudgetPlanModel> {
    return this.apiBudgetPlansService.insertBudgetPlan$(budgetPlanToSave);
  }

  deleteBudgetPlan$(id: string): Observable<BudgetPlanModel> {
    return this.apiBudgetPlansService.deleteBudgetPlan$(id);
  }
}
