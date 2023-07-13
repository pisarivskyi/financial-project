import { Injectable } from '@angular/core';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, finalize, tap } from 'rxjs';

import { ExpanseCategory } from '../../../api/expanse-categories/models/expanse-category.model';
import { PaginationInterface } from '../../../core/supabase/interfaces/pagination.interface';
import { PaginationModel } from '../../../core/supabase/models/pagination.model';
import {
  ApiInsertExpanseCategoryRowData,
  ApiUpdateExpanseCategoryRowData,
} from '../../../core/supabase/types/table.types';
import { UUID } from '../../../core/supabase/types/uuid.type';
import { ExpanseCategoriesService } from '../../services/expanse-categories.service';

@Injectable({
  providedIn: 'root',
})
export class ExpanseCategoriesFacadeService {
  private isLoadingSubject$ = new BehaviorSubject<boolean>(false);

  private expanseCategoriesSubject$ = new BehaviorSubject<ExpanseCategory[]>([]);

  private paginationSubject$ = new BehaviorSubject<PaginationModel>(
    new PaginationModel({
      pageIndex: 1,
      pageSize: 20,
      total: 0,
    })
  );

  isLoading$ = this.isLoadingSubject$.asObservable();

  expanseCategories$ = this.expanseCategoriesSubject$.asObservable();

  pagination$ = this.paginationSubject$.asObservable();

  constructor(private expanseCategoriesService: ExpanseCategoriesService) {}

  getExpanseCategories(): void {
    this.isLoadingSubject$.next(true);

    this.expanseCategoriesService
      .getExpanseCategories(this.paginationSubject$.value)
      .pipe(
        tap(({ data, count }) => {
          this.expanseCategoriesSubject$.next(data ?? []);

          this.paginationSubject$.next(
            this.paginationSubject$.value.patch({
              total: count ?? this.paginationSubject$.value.total,
            })
          );
        }),
        finalize(() => this.isLoadingSubject$.next(false))
      )
      .subscribe();
  }

  saveExpanseCategory(expanse: ApiInsertExpanseCategoryRowData): Observable<PostgrestResponse<ExpanseCategory>> {
    return this.expanseCategoriesService.saveExpanseCategory(expanse);
  }

  deleteExpanseCategory(id: UUID): Observable<PostgrestSingleResponse<null>> {
    return this.expanseCategoriesService.deleteExpanseCategory(id);
  }

  updateExpanseCategory(id: UUID, expanse: ApiUpdateExpanseCategoryRowData): Observable<PostgrestSingleResponse<null>> {
    return this.expanseCategoriesService.updateExpanseCategory(id, expanse);
  }

  updatePagination(pagination: Partial<PaginationInterface>): void {
    this.paginationSubject$.next(this.paginationSubject$.value.patch(pagination));
  }
}
