import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';

import { SupabaseService } from '../../../core/supabase/services/supabase.service';
import { DatabaseTableEnum } from '../../../core/supabase/enums/database-table.enum';
import {
  ApiGetExpanseRowData,
  ApiInsertExpanseRowData,
  ApiUpdateExpanseRowData
} from '../../../core/supabase/types/table.types';
import { ExpanseModel } from '../models/expanse.model';
import { UUID } from '../../../core/supabase/types/uuid.type';

@Injectable({
  providedIn: 'root'
})
export class ApiExpansesService {

  constructor(private supabaseService: SupabaseService) {}

  fetchExpanses(): Observable<PostgrestResponse<ExpanseModel>> {
    return from(
      this.supabaseService.getClient()
        .from(DatabaseTableEnum.Expanses)
        .select('*, category(id, name)')
    )
      .pipe(
        map((response: PostgrestResponse<ApiGetExpanseRowData>) => this.transformFromFetchExpanses(response))
      );
  }

  insertExpanse(expanse: ApiInsertExpanseRowData): Observable<PostgrestResponse<ExpanseModel>> {
    return from(
      this.supabaseService.getClient().from(DatabaseTableEnum.Expanses).insert(expanse).select()
    )
      .pipe(
        map((response: PostgrestResponse<ApiGetExpanseRowData>) => this.transformFromFetchExpanses(response))
      );
  }

  updateExpanse(id: UUID, expanseData: ApiUpdateExpanseRowData): Observable<PostgrestSingleResponse<null>> {
    return from(
      this.supabaseService.getClient()
        .from(DatabaseTableEnum.Expanses)
        .update(expanseData)
        .eq('id', id)
    );
  }

  deleteExpanse(id: UUID): Observable<PostgrestSingleResponse<null>> {
    return from(
      this.supabaseService.getClient().from(DatabaseTableEnum.Expanses).delete().eq('id', id)
    );
  }

  private transformFromFetchExpanses(response: PostgrestResponse<ApiGetExpanseRowData>): PostgrestResponse<ExpanseModel> {
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
