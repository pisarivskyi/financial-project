import { Injectable, inject } from '@angular/core';
import { createStore } from '@ngneat/elf';
import { selectAllEntities, setEntities, withEntities } from '@ngneat/elf-entities';
import { getRequestResult, trackRequestResult } from '@ngneat/elf-requests';
import { Observable, map, switchMap, take, tap } from 'rxjs';

import { BudgetModel } from '../../../api/budgets/models/budget.model';
import { CategoryModel } from '../../../api/categories/models/category.model';
import { updatePaginationData, withPaginationData } from '../../../core/pagination/utils/pagination-utils';
import { BudgetsService } from '../../services/budgets.service';
import { CategoriesService } from '../../services/categories.service';

@Injectable({
  providedIn: 'root',
})
export class BudgetsFacadeService {
  private readonly storyKey = 'budgets';

  private readonly requestKeys = {
    getBudgets: 'getBudgets',
  };

  private budgetsService = inject(BudgetsService);
  private categoriesService = inject(CategoriesService);

  store = createStore({ name: this.storyKey }, withEntities<BudgetModel>(), withPaginationData());

  budgets$ = this.store.pipe(selectAllEntities());

  pagination$ = this.store.pipe(map((s) => s.pagination));

  isLoading$ = getRequestResult([this.requestKeys.getBudgets]).pipe(map(({ isLoading }) => isLoading));

  loadBudgets(): void {
    this.store
      .pipe(
        take(1),
        switchMap(({ pagination }) => {
          return this.budgetsService.getBudgets$(pagination);
        }),
        tap(({ data, meta }) => {
          this.store.update(setEntities(data), updatePaginationData(meta));
        }),
        trackRequestResult([this.requestKeys.getBudgets], {
          skipCache: true,
        })
      )
      .subscribe();
  }

  saveBudget$(budgetToSave: BudgetModel): Observable<BudgetModel> {
    return this.budgetsService.saveBudget$(budgetToSave);
  }

  deleteBudget$(id: string): Observable<BudgetModel> {
    return this.budgetsService.deleteBudget$(id);
  }

  updateBudget$(budgetToUpdate: BudgetModel): Observable<BudgetModel> {
    return this.budgetsService.updateBudget$(budgetToUpdate);
  }

  getAllBudgets$(): Observable<BudgetModel[]> {
    return this.budgetsService.getBudgets$().pipe(map((response) => response.data));
  }

  getAllCategories$(): Observable<CategoryModel[]> {
    return this.categoriesService.getCategories$().pipe(map((response) => response.data));
  }

  updatePagination(pageIndex: number, pageSize: number): void {
    this.store.update(
      updatePaginationData({
        pageIndex,
        pageSize,
      })
    );
  }
}
