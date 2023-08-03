import { Injectable } from '@angular/core';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import { plainToInstance } from 'class-transformer';
import { Observable, from, map } from 'rxjs';

import { DatabaseTableEnum } from '../../../core/supabase/enums/database-table.enum';
import { PaginationInterface } from '../../../core/supabase/interfaces/pagination.interface';
import { SupabaseService } from '../../../core/supabase/services/supabase.service';
import {
  ApiGetRecordRowData,
  ApiInsertRecordRowData,
  ApiUpdateRecordRowData,
} from '../../../core/supabase/types/table.types';
import { UUID } from '../../../core/supabase/types/uuid.type';
import { RecordModel } from '../models/record.model';

@Injectable({
  providedIn: 'root',
})
export class ApiRecordsService {
  constructor(private supabaseService: SupabaseService) {}

  fetchRecords$(pagination?: PaginationInterface): Observable<PostgrestResponse<RecordModel>> {
    let builder = this.supabaseService
      .getClient()
      .from(DatabaseTableEnum.Records)
      .select('*, category(id, name)', { count: 'exact' });

    if (pagination) {
      const p = this.preparePagination(pagination);

      builder = builder.range(p.from, p.to);
    }

    return from(builder.throwOnError()).pipe(
      map((response: PostgrestResponse<ApiGetRecordRowData>) => this.transformFromFetchRecords(response))
    );
  }

  insertRecord$(recordData: ApiInsertRecordRowData): Observable<PostgrestResponse<RecordModel>> {
    return from(
      this.supabaseService.getClient().from(DatabaseTableEnum.Records).insert(recordData).select().throwOnError()
    ).pipe(map((response: PostgrestResponse<ApiGetRecordRowData>) => this.transformFromFetchRecords(response)));
  }

  updateRecord$(id: UUID, recordData: ApiUpdateRecordRowData): Observable<PostgrestSingleResponse<null>> {
    return from(
      this.supabaseService.getClient().from(DatabaseTableEnum.Records).update(recordData).eq('id', id).throwOnError()
    );
  }

  deleteRecord$(id: UUID): Observable<PostgrestSingleResponse<null>> {
    return from(this.supabaseService.getClient().from(DatabaseTableEnum.Records).delete().eq('id', id).throwOnError());
  }

  private transformFromFetchRecords(response: PostgrestResponse<ApiGetRecordRowData>): PostgrestResponse<RecordModel> {
    return {
      ...response,
      ...(response.data?.length ? { data: plainToInstance(RecordModel, response.data) } : { data: response.data }),
    } as PostgrestResponse<RecordModel>;
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
