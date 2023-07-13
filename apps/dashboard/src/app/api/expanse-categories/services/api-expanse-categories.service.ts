import { Injectable } from '@angular/core';
import { PostgrestResponse } from '@supabase/supabase-js';
import { Observable, from, map } from 'rxjs';

import { DatabaseTableEnum } from '../../../core/supabase/enums/database-table.enum';
import { SupabaseService } from '../../../core/supabase/services/supabase.service';
import { ApiGetExpanseCategoryRowData } from '../../../core/supabase/types/table.types';
import { ExpanseCategory } from '../models/expanse-category.model';

@Injectable({
  providedIn: 'root',
})
export class ApiExpanseCategoriesService {
  constructor(private supabaseService: SupabaseService) {}

  fetchExpanseCategories(): Observable<PostgrestResponse<ExpanseCategory>> {
    return from(this.supabaseService.getClient().from(DatabaseTableEnum.ExpanseCategories).select()).pipe(
      map((response) => this.transformFromExpanseCategories(response))
    );
  }

  transformFromExpanseCategories(
    response: PostgrestResponse<ApiGetExpanseCategoryRowData>
  ): PostgrestResponse<ExpanseCategory> {
    return {
      ...response,
      ...(response.data?.length
        ? { data: response.data.map((item) => new ExpanseCategory(item)) }
        : { data: response.data }),
    } as PostgrestResponse<ExpanseCategory>;
  }
}
