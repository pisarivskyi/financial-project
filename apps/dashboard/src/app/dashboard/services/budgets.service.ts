import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BudgetModel } from '../../api/budgets/models/budget.model';
import { ApiBudgetsService } from '../../api/budgets/services/api-budgets.service';
import { PaginatedResponse } from '../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../core/pagination/interfaces/pagination-params.interface';

@Injectable({
  providedIn: 'root',
})
export class BudgetsService {
  constructor(private apiBudgetsService: ApiBudgetsService) {}

  getBudgets$(pagination?: PaginationParamsInterface): Observable<PaginatedResponse<BudgetModel>> {
    return this.apiBudgetsService.extractBudgets$(pagination);
  }

  saveBudget$(categoryToSave: BudgetModel): Observable<BudgetModel> {
    return this.apiBudgetsService.insertBudget$(categoryToSave);
  }

  deleteBudget$(id: string): Observable<BudgetModel> {
    return this.apiBudgetsService.deleteBudget$(id);
  }

  updateBudget$(categoryToUpdate: BudgetModel): Observable<BudgetModel> {
    return this.apiBudgetsService.updateBudget$(categoryToUpdate);
  }
}
