import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { BudgetPlanInterface, PaginatedResponseInterface } from '@financial-project/common';

import { HttpMethodEnum } from '../../../core/communication/enums/http-method.enum';
import { CommunicationService } from '../../../core/communication/services/communication.service';
import { PaginatedResponse } from '../../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../../core/pagination/interfaces/pagination-params.interface';
import { BudgetPlanModel } from '../models/budget-plan.model';
import { ApiBudgetPlansTransformService } from './api-budget-plans-transform.service';

@Injectable({
  providedIn: 'root',
})
export class ApiBudgetPlansService {
  readonly requests = {
    budgetPlans: '/budget-plans',
  };

  constructor(
    private apiBudgetPlanTransformService: ApiBudgetPlansTransformService,
    private communicationService: CommunicationService,
  ) {}

  extractBudgetPlans$(pagination?: PaginationParamsInterface): Observable<PaginatedResponse<BudgetPlanModel>> {
    return this.communicationService
      .makeRequest<PaginatedResponseInterface<BudgetPlanInterface>>({
        method: HttpMethodEnum.Get,
        path: this.requests.budgetPlans,
        params: this.apiBudgetPlanTransformService.toExtractBudgetPlansParams(pagination),
      })
      .pipe(map((response) => this.apiBudgetPlanTransformService.fromExtractBudgetPlans(response)));
  }

  insertBudgetPlan$(budgetPlanToSave: BudgetPlanModel): Observable<BudgetPlanModel> {
    return this.communicationService
      .makeRequest<BudgetPlanInterface>({
        method: HttpMethodEnum.Post,
        path: this.requests.budgetPlans,
        payload: this.apiBudgetPlanTransformService.toInsertBudgetPlan(budgetPlanToSave),
      })
      .pipe(map((response) => this.apiBudgetPlanTransformService.fromInsertBudgetPlan(response)));
  }

  deleteBudgetPlan$(id: string): Observable<BudgetPlanModel> {
    return this.communicationService
      .makeRequest<BudgetPlanInterface>({
        method: HttpMethodEnum.Delete,
        path: `${this.requests.budgetPlans}/${id}`,
      })
      .pipe(map((response) => this.apiBudgetPlanTransformService.fromDeleteBudgetPlan(response)));
  }
}
