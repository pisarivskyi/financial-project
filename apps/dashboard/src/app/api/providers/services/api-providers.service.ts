import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
  AccountInterface,
  PaginatedResponseInterface,
  ProviderAccountDataInterface,
  ProviderAccountsInterface,
  ProviderInterface,
} from '@financial-project/common';

import { HttpMethodEnum } from '../../../core/communication/enums/http-method.enum';
import { CommunicationService } from '../../../core/communication/services/communication.service';
import { PaginatedResponse } from '../../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../../core/pagination/interfaces/pagination-params.interface';
import { AccountModel } from '../../accounts/models/account.model';
import { ProviderAccountsModel } from '../models/provider-accounts.model';
import { ProviderModel } from '../models/provider.model';
import { ApiProvidersTransformService } from './api-providers-transform.service';

@Injectable({
  providedIn: 'root',
})
export class ApiProvidersService {
  readonly requests = {
    providers: '/providers',
    providerAccounts: (id: string) => `/providers/${id}/get-accounts`,
    providerSaveAccounts: (id: string) => `/providers/${id}/save-accounts`,
  };

  constructor(
    private apiProvidersTransformService: ApiProvidersTransformService,
    private communicationService: CommunicationService
  ) {}

  extractProviders$(pagination?: PaginationParamsInterface): Observable<PaginatedResponse<ProviderModel>> {
    return this.communicationService
      .makeRequest<PaginatedResponseInterface<ProviderInterface>>({
        method: HttpMethodEnum.Get,
        path: this.requests.providers,
        params: this.apiProvidersTransformService.toExtractProvidersParams(pagination),
      })
      .pipe(map((response) => this.apiProvidersTransformService.fromExtractProviders(response)));
  }

  extractProviderAccounts$(providerId: string): Observable<ProviderAccountsModel> {
    return this.communicationService
      .makeRequest<ProviderAccountsInterface>({
        method: HttpMethodEnum.Get,
        path: this.requests.providerAccounts(providerId),
      })
      .pipe(map((response) => this.apiProvidersTransformService.fromExtractProviderAccounts(response)));
  }

  insertProvider$(provider: ProviderModel): Observable<ProviderModel> {
    return this.communicationService
      .makeRequest<ProviderInterface>({
        method: HttpMethodEnum.Post,
        path: `${this.requests.providers}/${provider.providerType}`,
        payload: this.apiProvidersTransformService.toInsertProvider(provider),
      })
      .pipe(map((response) => this.apiProvidersTransformService.fromInsertProvider(response)));
  }

  saveProviderAccounts$(providerId: string, accounts: ProviderAccountDataInterface[]): Observable<AccountModel[]> {
    return this.communicationService
      .makeRequest<AccountInterface[]>({
        method: HttpMethodEnum.Post,
        path: this.requests.providerSaveAccounts(providerId),
        payload: this.apiProvidersTransformService.toSaveProviderAccounts(accounts),
      })
      .pipe(map((response) => this.apiProvidersTransformService.fromSaveProviderAccounts(response)));
  }
}
