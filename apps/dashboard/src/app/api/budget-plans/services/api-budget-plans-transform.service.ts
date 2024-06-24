import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';

import { BudgetPlanInterface, PaginatedResponseInterface } from '@financial-project/common';

import { PaginatedResponse } from '../../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../../core/pagination/interfaces/pagination-params.interface';
import { toPaginationQueryParams } from '../../../core/pagination/utils/pagination-utils';
import { BudgetPlanModel } from '../models/budget-plan.model';
import { InsertBudgetPlanDataType } from '../types/api-budget-plans.types';

@Injectable({
  providedIn: 'root',
})
export class ApiBudgetPlansTransformService {
  fromExtractBudgetPlans(
    response: PaginatedResponseInterface<BudgetPlanInterface>,
  ): PaginatedResponse<BudgetPlanModel> {
    return new PaginatedResponse<BudgetPlanModel>(
      response.data.map((d) => this.toBudgetPlanModel(d)),
      response.meta,
    );
  }

  toExtractBudgetPlansParams(pagination?: PaginationParamsInterface) {
    return new HttpParams({
      fromObject: toPaginationQueryParams(pagination),
    });
  }

  fromInsertBudgetPlan(response: BudgetPlanInterface): BudgetPlanModel {
    return this.toBudgetPlanModel(response);
  }

  toInsertBudgetPlan({
    year,
    month,
    budgetSnapshots,
    plannedPaymentSnapshots,
  }: BudgetPlanModel): InsertBudgetPlanDataType {
    return {
      year,
      month,
      budgetSnapshotIds: budgetSnapshots.map((budgetSnapshot) => budgetSnapshot.id),
      plannedPaymentSnapshotIds: plannedPaymentSnapshots.map((plannedPaymentSnapshot) => plannedPaymentSnapshot.id),
    };
  }

  fromDeleteBudgetPlan(response: BudgetPlanInterface): BudgetPlanModel {
    return this.toBudgetPlanModel(response);
  }

  private toBudgetPlanModel(plain: BudgetPlanInterface): BudgetPlanModel {
    return plainToInstance(BudgetPlanModel, plain);
  }
}
