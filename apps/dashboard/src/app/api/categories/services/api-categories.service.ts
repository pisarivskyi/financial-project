import { Injectable } from '@angular/core';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import { Observable, from, map } from 'rxjs';

import { DatabaseTableEnum } from '../../../core/supabase/enums/database-table.enum';
import { SupabaseService } from '../../../core/supabase/services/supabase.service';
import {
  ApiGetCategoryRowData,
  ApiInsertCategoryRowData,
  ApiUpdateCategoryRowData,
} from '../../../core/supabase/types/table.types';
import { Category } from '../models/category.model';
import { PaginationInterface } from '../../../core/supabase/interfaces/pagination.interface';
import { UUID } from '../../../core/supabase/types/uuid.type';

@Injectable({
  providedIn: 'root',
})
export class ApiCategoriesService {
  constructor(private supabaseService: SupabaseService) {}

  fetchCategories$(pagination?: PaginationInterface): Observable<PostgrestResponse<Category>> {
    let builder = this.supabaseService
      .getClient()
      .from(DatabaseTableEnum.Categories)
      .select('*', { count: 'exact' });

    if (pagination) {
      const p = this.preparePagination(pagination);

      builder = builder.range(p.from, p.to);
    }

    return from(builder).pipe(
      map((response) => this.transformFromCategories(response))
    );
  }

  insertCategory$(categoryData: ApiInsertCategoryRowData): Observable<PostgrestResponse<Category>> {
    return from(this.supabaseService.getClient().from(DatabaseTableEnum.Categories).insert(categoryData).select()).pipe(
      map((response: PostgrestResponse<ApiGetCategoryRowData>) => this.transformFromCategories(response))
    );
  }

  updateCategory$(id: UUID, categoryData: ApiUpdateCategoryRowData): Observable<PostgrestSingleResponse<null>> {
    return from(this.supabaseService.getClient().from(DatabaseTableEnum.Categories).update(categoryData).eq('id', id));
  }

  deleteCategory$(id: UUID): Observable<PostgrestSingleResponse<null>> {
    return from(this.supabaseService.getClient().from(DatabaseTableEnum.Categories).delete().eq('id', id));
  }

  private transformFromCategories(
    response: PostgrestResponse<ApiGetCategoryRowData>
  ): PostgrestResponse<Category> {
    return {
      ...response,
      ...(response.data?.length
        ? { data: response.data.map((item) => new Category(item)) }
        : { data: response.data }),
    } as PostgrestResponse<Category>;
  }

  private preparePagination(pagination: PaginationInterface): { from: number; to: number } {
    const from = (pagination.pageIndex - 1) * pagination.pageSize;
    const to = from + (pagination.pageSize - 1);

    return {
      from,
      to,
    };
  }
}
