import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import { selectAllEntities, setEntities, withEntities } from '@ngneat/elf-entities';
import { getRequestResult, trackRequestResult } from '@ngneat/elf-requests';
import { Observable, map, switchMap, take, tap } from 'rxjs';

import { BudgetPlanModel } from '../../../../api/budget-plans/models/budget-plan.model';
import { updatePaginationData, withPaginationData } from '../../../../core/pagination/utils/pagination-utils';
import { BudgetPlansService } from '../../../services/budget-plans.service';

@Injectable({
  providedIn: 'root',
})
export class BudgetPlansWorkspaceFacadeService {
  private readonly storyKey = 'budgetPlans';

  private readonly requestKeys = {
    getBudgetPlans: 'getBudgetPlans',
  };

  store = createStore({ name: this.storyKey }, withEntities<BudgetPlanModel>(), withPaginationData());

  isLoading$ = getRequestResult([this.requestKeys.getBudgetPlans]).pipe(map(({ isLoading }) => isLoading));

  budgetPlans$ = this.store.pipe(selectAllEntities());

  pagination$ = this.store.pipe(map((s) => s.pagination));

  constructor(private budgetPlansService: BudgetPlansService) {}

  loadBudgetPlans(): void {
    this.store
      .pipe(
        take(1),
        switchMap(({ pagination }) => {
          return this.budgetPlansService.getBudgetPlans$(pagination);
        }),
        tap(({ data, meta }) => {
          this.store.update(setEntities(data), updatePaginationData(meta));
        }),
        trackRequestResult([this.requestKeys.getBudgetPlans], {
          skipCache: true,
        }),
      )
      .subscribe();
  }

  deleteBudgetPlan$(id: string): Observable<BudgetPlanModel> {
    return this.budgetPlansService.deleteBudgetPlan$(id);
  }

  // updateAccount$(accountToUpdate: AccountModel): Observable<AccountModel> {
  //   return this.budgetPlansService.updateBudgetPlan$(accountToUpdate);
  // }

  updatePagination(pageIndex: number, pageSize: number): void {
    this.store.update(
      updatePaginationData({
        pageIndex,
        pageSize,
      }),
    );
  }
}
