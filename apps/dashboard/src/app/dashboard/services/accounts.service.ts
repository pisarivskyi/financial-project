import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountModel } from '../../api/accounts/models/account.model';
import { SynchronizationJobModel } from '../../api/accounts/models/synchronization-job.model';
import { ApiAccountsService } from '../../api/accounts/services/api-accounts.service';
import { PaginatedResponse } from '../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../core/pagination/interfaces/pagination-params.interface';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  constructor(private apiAccountsService: ApiAccountsService) {}

  getAccounts$(pagination?: PaginationParamsInterface): Observable<PaginatedResponse<AccountModel>> {
    return this.apiAccountsService.extractAccounts$(pagination);
  }

  deleteAccount$(id: string): Observable<AccountModel> {
    return this.apiAccountsService.deleteAccount$(id);
  }

  updateAccount$(accountToUpdate: AccountModel): Observable<AccountModel> {
    return this.apiAccountsService.updateAccount$(accountToUpdate);
  }

  triggerSynchronizationForAccount$(id: string): Observable<SynchronizationJobModel> {
    return this.apiAccountsService.triggerSynchronizationForAccount$(id);
  }

  getSynchronizationJob$(id: string): Observable<SynchronizationJobModel> {
    return this.apiAccountsService.extractSynchronizationJob$(id);
  }
}
