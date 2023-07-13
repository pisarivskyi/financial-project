import { Injectable } from '@angular/core';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import { Observable } from 'rxjs';

import { ExpanseCategory } from '../../api/expanse-categories/models/expanse-category.model';
import { ApiExpanseCategoriesService } from '../../api/expanse-categories/services/api-expanse-categories.service';
import { PaginationInterface } from '../../core/supabase/interfaces/pagination.interface';
import {
  ApiInsertExpanseCategoryRowData,
  ApiUpdateExpanseCategoryRowData,
} from '../../core/supabase/types/table.types';
import { UUID } from '../../core/supabase/types/uuid.type';

@Injectable({
  providedIn: 'root',
})
export class ExpanseCategoriesService {
  constructor(private apiExpanseCategoriesService: ApiExpanseCategoriesService) {}

  getExpanseCategories(pagination?: PaginationInterface): Observable<PostgrestResponse<ExpanseCategory>> {
    return this.apiExpanseCategoriesService.fetchExpanseCategories(pagination);
  }

  saveExpanseCategory(expanse: ApiInsertExpanseCategoryRowData): Observable<PostgrestResponse<ExpanseCategory>> {
    return this.apiExpanseCategoriesService.insertExpanseCategory(expanse);
  }

  deleteExpanseCategory(id: UUID): Observable<PostgrestSingleResponse<null>> {
    return this.apiExpanseCategoriesService.deleteExpanseCategory(id);
  }

  updateExpanseCategory(
    id: UUID,
    expanseData: ApiUpdateExpanseCategoryRowData
  ): Observable<PostgrestSingleResponse<null>> {
    return this.apiExpanseCategoriesService.updateExpanseCategory(id, expanseData);
  }
}
