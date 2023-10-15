import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';

import { BudgetInterface, PaginatedResponseInterface } from '@financial-project/common';

import { PaginatedResponse } from '../../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../../core/pagination/interfaces/pagination-params.interface';
import { toPaginationQueryParams } from '../../../core/pagination/utils/pagination-utils';
import { BudgetModel } from '../models/budget.model';
import { InsertBudgetDataType, UpdateBudgetDataType } from '../types/api-budgets.types';

@Injectable({
  providedIn: 'root',
})
export class ApiBudgetsTransformService {
  fromExtractBudgets(response: PaginatedResponseInterface<BudgetInterface>): PaginatedResponse<BudgetModel> {
    return new PaginatedResponse<BudgetModel>(
      response.data.map((d) => this.toBudgetModel(d)),
      response.meta
    );
  }

  toExtractBudgetsParams(pagination?: PaginationParamsInterface) {
    return new HttpParams({
      fromObject: toPaginationQueryParams(pagination),
    });
  }

  fromInsertBudget(response: BudgetInterface): BudgetModel {
    return this.toBudgetModel(response);
  }

  toInsertBudget({
    name,
    color,
    amount,
    categories,
    period,
    currencyCode,
    fromDate,
    toDate,
  }: BudgetModel): InsertBudgetDataType {
    return {
      amount,
      categoryIds: categories.map((category) => category.id),
      currencyCode: currencyCode,
      period,
      name,
      color,
      fromDate,
      toDate,
    };
  }

  toUpdateBudget({
    name,
    color,
    amount,
    categories,
    period,
    currencyCode,
    fromDate,
    toDate,
  }: BudgetModel): UpdateBudgetDataType {
    return {
      amount,
      ...(categories.length ? { categoryIds: categories.map((category) => category.id) } : {}),
      currencyCode: currencyCode,
      period,
      name,
      color,
      fromDate,
      toDate,
    };
  }

  fromUpdateBudget(response: BudgetInterface): BudgetModel {
    return this.toBudgetModel(response);
  }

  fromDeleteBudget(response: BudgetInterface): BudgetModel {
    return this.toBudgetModel(response);
  }

  private toBudgetModel(plain: BudgetInterface): BudgetModel {
    return plainToInstance(BudgetModel, plain);
  }
}
