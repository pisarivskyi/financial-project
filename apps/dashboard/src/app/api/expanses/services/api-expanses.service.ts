import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { PostgrestResponse } from '@supabase/supabase-js';

import { SupabaseService } from '../../../core/supabase/services/supabase.service';
import { DatabaseTableEnum } from '../../../core/supabase/enums/database-table.enum';
import { ApiGetExpanseRowData } from '../../../core/supabase/types/table.types';
import { ExpanseModel } from '../models/expanse.model';

@Injectable({
  providedIn: 'root'
})
export class ApiExpansesService {

  constructor(private supabaseService: SupabaseService) {}

  fetchExpanses(): Observable<PostgrestResponse<ExpanseModel>> {
    return from(
      this.supabaseService.getClient().from(DatabaseTableEnum.Expanses).select()
    )
      .pipe(
        map((response: PostgrestResponse<ApiGetExpanseRowData>) => this.transformFromExpanses(response))
      );
  }

  transformFromExpanses(response: PostgrestResponse<ApiGetExpanseRowData>): PostgrestResponse<ExpanseModel> {
    return {
      ...response,
      ...(
        response.data?.length
          ? { data: response.data.map((item) => new ExpanseModel(item)) }
          : { data: response.data }
      )

    } as PostgrestResponse<ExpanseModel>;
  }
}
