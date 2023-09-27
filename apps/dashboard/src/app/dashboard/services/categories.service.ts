import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CategoryModel } from '../../api/categories/models/category.model';
import { ApiCategoriesService } from '../../api/categories/services/api-categories.service';
import { PaginatedResponse } from '../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../core/pagination/interfaces/pagination-params.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private apiCategoriesService: ApiCategoriesService) {}

  getCategories$(pagination?: PaginationParamsInterface): Observable<PaginatedResponse<CategoryModel>> {
    return this.apiCategoriesService.extractCategories$(pagination);
  }

  saveCategory$(categoryToSave: CategoryModel): Observable<CategoryModel> {
    return this.apiCategoriesService.insertCategory$(categoryToSave);
  }

  deleteCategory$(id: string): Observable<CategoryModel> {
    return this.apiCategoriesService.deleteCategory$(id);
  }

  updateCategory$(categoryToUpdate: CategoryModel): Observable<CategoryModel> {
    return this.apiCategoriesService.updateCategory$(categoryToUpdate);
  }
}
