import { Injectable } from '@angular/core';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import { Observable } from 'rxjs';

import { Account } from '../../api/accounts/models/account.model';
import { ApiAccountsService } from '../../api/accounts/services/api-accounts.service';
import { PaginationInterface } from '../../core/supabase/interfaces/pagination.interface';
import { ApiInsertAccountRowData, ApiUpdateAccountRowData } from '../../core/supabase/types/table.types';
import { UUID } from '../../core/supabase/types/uuid.type';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  constructor(private apiAccountsService: ApiAccountsService) {}

  getAccounts$(pagination?: PaginationInterface): Observable<PostgrestResponse<Account>> {
    return this.apiAccountsService.fetchAccounts$(pagination);
  }

  saveAccount$(accountData: ApiInsertAccountRowData): Observable<PostgrestResponse<Account>> {
    return this.apiAccountsService.insertAccount$(accountData);
  }

  deleteAccount$(id: UUID): Observable<PostgrestSingleResponse<null>> {
    return this.apiAccountsService.deleteAccount$(id);
  }

  updateAccount$(id: UUID, accountData: ApiUpdateAccountRowData): Observable<PostgrestSingleResponse<null>> {
    return this.apiAccountsService.updateAccount$(id, accountData);
  }
}
