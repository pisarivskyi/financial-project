import { Injectable } from '@angular/core';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, finalize, tap } from 'rxjs';

import { Category } from '../../../api/categories/models/category.model';
import { PaginationInterface } from '../../../core/supabase/interfaces/pagination.interface';
import { PaginationModel } from '../../../core/supabase/models/pagination.model';
import {
  ApiInsertCategoryRowData,
  ApiUpdateCategoryRowData,
} from '../../../core/supabase/types/table.types';
import { UUID } from '../../../core/supabase/types/uuid.type';
import { CategoriesService } from '../../services/categories.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriesFacadeService {
  private isLoadingSubject$ = new BehaviorSubject<boolean>(false);

  private categoriesSubject$ = new BehaviorSubject<Category[]>([]);

  private paginationSubject$ = new BehaviorSubject<PaginationModel>(
    new PaginationModel({
      pageIndex: 1,
      pageSize: 20,
      total: 0,
    })
  );

  isLoading$ = this.isLoadingSubject$.asObservable();

  categories$ = this.categoriesSubject$.asObservable();

  pagination$ = this.paginationSubject$.asObservable();

  constructor(private categoriesService: CategoriesService) {}

  getCategories(): void {
    this.isLoadingSubject$.next(true);

    this.categoriesService
      .getCategories$(this.paginationSubject$.value)
      .pipe(
        tap(({ data, count }) => {
          this.categoriesSubject$.next(data ?? []);

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

  saveCategory$(categoryData: ApiInsertCategoryRowData): Observable<PostgrestResponse<Category>> {
    return this.categoriesService.saveCategory$(categoryData);
  }

  deleteCategory$(id: UUID): Observable<PostgrestSingleResponse<null>> {
    return this.categoriesService.deleteCategory$(id);
  }

  updateCategory$(id: UUID, categoryData: ApiUpdateCategoryRowData): Observable<PostgrestSingleResponse<null>> {
    return this.categoriesService.updateCategory$(id, categoryData);
  }

  updatePagination(pagination: Partial<PaginationInterface>): void {
    this.paginationSubject$.next(this.paginationSubject$.value.patch(pagination));
  }
}
