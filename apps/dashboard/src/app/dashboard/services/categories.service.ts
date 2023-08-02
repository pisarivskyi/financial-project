import { Injectable } from '@angular/core';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import { Observable } from 'rxjs';

import { Category } from '../../api/categories/models/category.model';
import { ApiCategoriesService } from '../../api/categories/services/api-categories.service';
import { PaginationInterface } from '../../core/supabase/interfaces/pagination.interface';
import {
  ApiInsertCategoryRowData,
  ApiUpdateCategoryRowData,
} from '../../core/supabase/types/table.types';
import { UUID } from '../../core/supabase/types/uuid.type';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private apiCategoriesService: ApiCategoriesService) {}

  getCategories$(pagination?: PaginationInterface): Observable<PostgrestResponse<Category>> {
    return this.apiCategoriesService.fetchCategories$(pagination);
  }

  saveCategory$(categoryData: ApiInsertCategoryRowData): Observable<PostgrestResponse<Category>> {
    return this.apiCategoriesService.insertCategory$(categoryData);
  }

  deleteCategory$(id: UUID): Observable<PostgrestSingleResponse<null>> {
    return this.apiCategoriesService.deleteCategory$(id);
  }

  updateCategory$(
    id: UUID,
    categoryData: ApiUpdateCategoryRowData
  ): Observable<PostgrestSingleResponse<null>> {
    return this.apiCategoriesService.updateCategory$(id, categoryData);
  }
}
