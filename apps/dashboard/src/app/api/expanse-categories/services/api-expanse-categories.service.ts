import { Injectable } from '@angular/core';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import { Observable, from, map } from 'rxjs';

import { DatabaseTableEnum } from '../../../core/supabase/enums/database-table.enum';
import { SupabaseService } from '../../../core/supabase/services/supabase.service';
import {
  ApiGetExpanseCategoryRowData,
  ApiInsertExpanseCategoryRowData,
  ApiUpdateExpanseCategoryRowData,
} from '../../../core/supabase/types/table.types';
import { ExpanseCategory } from '../models/expanse-category.model';
import { PaginationInterface } from '../../../core/supabase/interfaces/pagination.interface';
import { UUID } from '../../../core/supabase/types/uuid.type';

@Injectable({
  providedIn: 'root',
})
export class ApiExpanseCategoriesService {
  constructor(private supabaseService: SupabaseService) {}

  fetchExpanseCategories(pagination?: PaginationInterface): Observable<PostgrestResponse<ExpanseCategory>> {
    let builder = this.supabaseService
      .getClient()
      .from(DatabaseTableEnum.ExpanseCategories)
      .select('*', { count: 'exact' });

    if (pagination) {
      const p = this.preparePagination(pagination);

      builder = builder.range(p.from, p.to);
    }

    return from(builder).pipe(
      map((response) => this.transformFromExpanseCategories(response))
    );
  }

  insertExpanseCategory(expanseCategory: ApiInsertExpanseCategoryRowData): Observable<PostgrestResponse<ExpanseCategory>> {
    return from(this.supabaseService.getClient().from(DatabaseTableEnum.ExpanseCategories).insert(expanseCategory).select()).pipe(
      map((response: PostgrestResponse<ApiGetExpanseCategoryRowData>) => this.transformFromExpanseCategories(response))
    );
  }

  updateExpanseCategory(id: UUID, expanseCategoryData: ApiUpdateExpanseCategoryRowData): Observable<PostgrestSingleResponse<null>> {
    return from(this.supabaseService.getClient().from(DatabaseTableEnum.ExpanseCategories).update(expanseCategoryData).eq('id', id));
  }

  deleteExpanseCategory(id: UUID): Observable<PostgrestSingleResponse<null>> {
    return from(this.supabaseService.getClient().from(DatabaseTableEnum.ExpanseCategories).delete().eq('id', id));
  }

  private transformFromExpanseCategories(
    response: PostgrestResponse<ApiGetExpanseCategoryRowData>
  ): PostgrestResponse<ExpanseCategory> {
    return {
      ...response,
      ...(response.data?.length
        ? { data: response.data.map((item) => new ExpanseCategory(item)) }
        : { data: response.data }),
    } as PostgrestResponse<ExpanseCategory>;
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
