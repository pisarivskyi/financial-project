import { Injectable } from '@angular/core';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import { plainToInstance } from 'class-transformer';
import { Observable, from, map } from 'rxjs';

import { DatabaseTableEnum } from '../../../core/supabase/enums/database-table.enum';
import { PaginationInterface } from '../../../core/supabase/interfaces/pagination.interface';
import { SupabaseService } from '../../../core/supabase/services/supabase.service';
import {
  ApiGetAccountRowData,
  ApiInsertAccountRowData,
  ApiUpdateAccountRowData,
} from '../../../core/supabase/types/table.types';
import { UUID } from '../../../core/supabase/types/uuid.type';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root',
})
export class ApiAccountsService {
  constructor(private supabaseService: SupabaseService) {}

  fetchAccounts$(pagination?: PaginationInterface): Observable<PostgrestResponse<Account>> {
    let builder = this.supabaseService.getClient().from(DatabaseTableEnum.Accounts).select('*', { count: 'exact' });

    if (pagination) {
      const p = this.preparePagination(pagination);

      builder = builder.range(p.from, p.to);
    }

    return from(builder.throwOnError()).pipe(map((response) => this.transformFromAccounts(response)));
  }

  insertAccount$(accountData: ApiInsertAccountRowData): Observable<PostgrestResponse<Account>> {
    return from(
      this.supabaseService.getClient().from(DatabaseTableEnum.Accounts).insert(accountData).select().throwOnError()
    ).pipe(map((response: PostgrestResponse<ApiGetAccountRowData>) => this.transformFromAccounts(response)));
  }

  updateAccount$(id: UUID, accountData: ApiUpdateAccountRowData): Observable<PostgrestSingleResponse<null>> {
    return from(
      this.supabaseService.getClient().from(DatabaseTableEnum.Accounts).update(accountData).eq('id', id).throwOnError()
    );
  }

  deleteAccount$(id: UUID): Observable<PostgrestSingleResponse<null>> {
    return from(this.supabaseService.getClient().from(DatabaseTableEnum.Accounts).delete().eq('id', id).throwOnError());
  }

  private transformFromAccounts(response: PostgrestResponse<ApiGetAccountRowData>): PostgrestResponse<Account> {
    return {
      ...response,
      ...(response.data?.length ? { data: plainToInstance(Account, response.data) } : { data: response.data }),
    } as PostgrestResponse<Account>;
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
