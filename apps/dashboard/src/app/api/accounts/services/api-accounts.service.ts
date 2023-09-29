import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { AccountInterface, PaginatedResponseInterface } from '@financial-project/common';

import { HttpMethodEnum } from '../../../core/communication/enums/http-method.enum';
import { CommunicationService } from '../../../core/communication/services/communication.service';
import { PaginatedResponse } from '../../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../../core/pagination/interfaces/pagination-params.interface';
import { AccountModel } from '../models/account.model';
import { ApiAccountsTransformService } from './api-accounts-transform.service';

@Injectable({
  providedIn: 'root',
})
export class ApiAccountsService {
  readonly requests = {
    accounts: '/accounts',
  };

  constructor(
    private apiAccountsTransformService: ApiAccountsTransformService,
    private communicationService: CommunicationService
  ) {}

  extractAccounts$(pagination?: PaginationParamsInterface): Observable<PaginatedResponse<AccountModel>> {
    return this.communicationService
      .makeRequest<PaginatedResponseInterface<AccountInterface>>({
        method: HttpMethodEnum.Get,
        path: this.requests.accounts,
        params: this.apiAccountsTransformService.toExtractAccountsParams(pagination),
      })
      .pipe(map((response) => this.apiAccountsTransformService.fromExtractAccounts(response)));
  }

  updateAccount$(accountToUpdate: AccountModel): Observable<AccountModel> {
    return this.communicationService
      .makeRequest<AccountInterface>({
        method: HttpMethodEnum.Patch,
        path: `${this.requests.accounts}/${accountToUpdate.id}`,
        payload: this.apiAccountsTransformService.toUpdateAccount(accountToUpdate),
      })
      .pipe(map((response) => this.apiAccountsTransformService.fromUpdateAccount(response)));
  }

  deleteAccount$(id: string): Observable<AccountModel> {
    return this.communicationService
      .makeRequest<AccountInterface>({
        method: HttpMethodEnum.Delete,
        path: `${this.requests.accounts}/${id}`,
      })
      .pipe(map((response) => this.apiAccountsTransformService.fromDeleteAccount(response)));
  }
}
