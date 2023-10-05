import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';

import {
  AccountInterface,
  PaginatedResponseInterface,
  ProviderAccountDataInterface,
  ProviderAccountsInterface,
  ProviderInterface,
} from '@financial-project/common';

import { PaginatedResponse } from '../../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../../core/pagination/interfaces/pagination-params.interface';
import { toPaginationQueryParams } from '../../../core/pagination/utils/pagination-utils';
import { AccountModel } from '../../accounts/models/account.model';
import { ProviderAccountsModel } from '../models/provider-accounts.model';
import { ProviderModel } from '../models/provider.model';
import { InsertProviderType, SaveProviderAccountsType, UpdateProviderType } from '../types/api-providers.types';

@Injectable({
  providedIn: 'root',
})
export class ApiProvidersTransformService {
  toExtractProvidersParams(pagination?: PaginationParamsInterface) {
    return new HttpParams({
      fromObject: toPaginationQueryParams(pagination),
    });
  }

  fromExtractProviders(response: PaginatedResponseInterface<ProviderInterface>): PaginatedResponse<ProviderModel> {
    return new PaginatedResponse<ProviderModel>(
      response.data.map((d) => this.toProviderModel(d)),
      response.meta
    );
  }

  toInsertProvider({ name, data }: ProviderModel): InsertProviderType {
    return {
      name,
      data,
    };
  }

  fromInsertProvider(response: ProviderInterface): ProviderModel {
    return this.toProviderModel(response);
  }

  fromExtractProviderAccounts(response: ProviderAccountsInterface): ProviderAccountsModel {
    return this.toProviderAccountsModel(response);
  }

  toSaveProviderAccounts(accounts: ProviderAccountDataInterface[]): SaveProviderAccountsType {
    return {
      accountIds: accounts.map((account) => account.id),
    };
  }

  fromSaveProviderAccounts(accounts: AccountInterface[]): AccountModel[] {
    return accounts.map((account) => this.toAccountModel(account));
  }

  fromDeleteProvider(response: ProviderInterface): ProviderModel {
    return this.toProviderModel(response);
  }

  toUpdateProvider({ name }: ProviderModel): UpdateProviderType {
    return {
      name,
    };
  }

  fromUpdateProvider(response: ProviderInterface): ProviderModel {
    return this.toProviderModel(response);
  }

  private toProviderModel(plain: ProviderInterface): ProviderModel {
    return plainToInstance(ProviderModel, plain);
  }

  private toProviderAccountsModel(plain: ProviderAccountsInterface): ProviderAccountsModel {
    return plainToInstance(ProviderAccountsModel, plain);
  }

  private toAccountModel(plain: AccountInterface): AccountModel {
    return plainToInstance(AccountModel, plain);
  }
}
