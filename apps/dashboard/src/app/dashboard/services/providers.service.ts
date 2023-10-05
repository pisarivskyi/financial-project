import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProviderAccountDataInterface } from '@financial-project/common';

import { AccountModel } from '../../api/accounts/models/account.model';
import { ProviderAccountsModel } from '../../api/providers/models/provider-accounts.model';
import { ProviderModel } from '../../api/providers/models/provider.model';
import { ApiProvidersService } from '../../api/providers/services/api-providers.service';
import { PaginatedResponse } from '../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../core/pagination/interfaces/pagination-params.interface';

@Injectable({
  providedIn: 'root',
})
export class ProvidersService {
  constructor(private apiProvidersService: ApiProvidersService) {}

  getProviders$(pagination?: PaginationParamsInterface): Observable<PaginatedResponse<ProviderModel>> {
    return this.apiProvidersService.extractProviders$(pagination);
  }

  getProviderAccounts$(providerId: string): Observable<ProviderAccountsModel> {
    return this.apiProvidersService.extractProviderAccounts$(providerId);
  }

  saveProvider$(provider: ProviderModel): Observable<ProviderModel> {
    return this.apiProvidersService.insertProvider$(provider);
  }

  updateProvider$(provider: ProviderModel): Observable<ProviderModel> {
    return this.apiProvidersService.updateProvider$(provider);
  }

  deleteProvider$(id: string): Observable<ProviderModel> {
    return this.apiProvidersService.deleteProvider$(id);
  }

  saveProviderAccounts$(providerId: string, accounts: ProviderAccountDataInterface[]): Observable<AccountModel[]> {
    return this.apiProvidersService.saveProviderAccounts$(providerId, accounts);
  }
}
