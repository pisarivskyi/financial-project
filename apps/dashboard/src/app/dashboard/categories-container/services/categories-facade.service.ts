import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import { selectAllEntities, setEntities, withEntities } from '@ngneat/elf-entities';
import { getRequestResult, trackRequestResult } from '@ngneat/elf-requests';
import { Observable, map, switchMap, take, tap } from 'rxjs';

import { CategoryModel } from '../../../api/categories/models/category.model';
import { updatePaginationData, withPaginationData } from '../../../core/pagination/utils/pagination-utils';
import { CategoriesService } from '../../services/categories.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriesFacadeService {
  private readonly storyKey = 'categories';

  private readonly requestKeys = {
    getCategories: 'getCategories',
  };

  store = createStore({ name: this.storyKey }, withEntities<CategoryModel>(), withPaginationData());

  categories$ = this.store.pipe(selectAllEntities());

  pagination$ = this.store.pipe(map((s) => s.pagination));

  isLoading$ = getRequestResult([this.requestKeys.getCategories]).pipe(map(({ isLoading }) => isLoading));

  constructor(private categoriesService: CategoriesService) {}

  loadCategories(): void {
    this.store
      .pipe(
        take(1),
        switchMap(({ pagination }) => {
          return this.categoriesService.getCategories$(pagination);
        }),
        tap(({ data, meta }) => {
          this.store.update(setEntities(data), updatePaginationData(meta));
        }),
        trackRequestResult([this.requestKeys.getCategories], {
          skipCache: true,
        })
      )
      .subscribe();
  }

  saveCategory$(categoryToSave: CategoryModel): Observable<CategoryModel> {
    return this.categoriesService.saveCategory$(categoryToSave);
  }

  deleteCategory$(id: string): Observable<CategoryModel> {
    return this.categoriesService.deleteCategory$(id);
  }

  updateCategory$(categoryToUpdate: CategoryModel): Observable<CategoryModel> {
    return this.categoriesService.updateCategory$(categoryToUpdate);
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
