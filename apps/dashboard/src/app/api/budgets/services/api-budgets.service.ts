import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { BudgetInterface, PaginatedResponseInterface } from '@financial-project/common';

import { HttpMethodEnum } from '../../../core/communication/enums/http-method.enum';
import { CommunicationService } from '../../../core/communication/services/communication.service';
import { PaginatedResponse } from '../../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../../core/pagination/interfaces/pagination-params.interface';
import { BudgetModel } from '../models/budget.model';
import { ApiBudgetsTransformService } from './api-budgets-transform.service';

@Injectable({
  providedIn: 'root',
})
export class ApiBudgetsService {
  readonly requests = {
    budgets: '/budgets',
    updateBudget: (id: string) => `/budgets/${id}`,
    deleteBudget: (id: string) => `/budgets/${id}`,
  };

  constructor(
    private apiBudgetsTransformService: ApiBudgetsTransformService,
    private communicationService: CommunicationService
  ) {}

  extractBudgets$(pagination?: PaginationParamsInterface): Observable<PaginatedResponse<BudgetModel>> {
    return this.communicationService
      .makeRequest<PaginatedResponseInterface<BudgetInterface>>({
        method: HttpMethodEnum.Get,
        path: this.requests.budgets,
        params: this.apiBudgetsTransformService.toExtractBudgetsParams(pagination),
      })
      .pipe(map((response) => this.apiBudgetsTransformService.fromExtractBudgets(response)));
  }

  insertBudget$(budgetToSave: BudgetModel): Observable<BudgetModel> {
    return this.communicationService
      .makeRequest<BudgetInterface>({
        method: HttpMethodEnum.Post,
        path: this.requests.budgets,
        payload: this.apiBudgetsTransformService.toInsertBudget(budgetToSave),
      })
      .pipe(map((response) => this.apiBudgetsTransformService.fromInsertBudget(response)));
  }

  updateBudget$(budgetToUpdate: BudgetModel): Observable<BudgetModel> {
    return this.communicationService
      .makeRequest<BudgetInterface>({
        method: HttpMethodEnum.Patch,
        path: this.requests.updateBudget(budgetToUpdate.id),
        payload: this.apiBudgetsTransformService.toUpdateBudget(budgetToUpdate),
      })
      .pipe(map((response) => this.apiBudgetsTransformService.fromUpdateBudget(response)));
  }

  deleteBudget$(id: string): Observable<BudgetModel> {
    return this.communicationService
      .makeRequest<BudgetInterface>({
        method: HttpMethodEnum.Delete,
        path: this.requests.deleteBudget(id),
      })
      .pipe(map((response) => this.apiBudgetsTransformService.fromDeleteBudget(response)));
  }
}
