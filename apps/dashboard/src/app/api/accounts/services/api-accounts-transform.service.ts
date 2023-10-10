import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';

import { AccountInterface, PaginatedResponseInterface } from '@financial-project/common';

import { PaginatedResponse } from '../../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../../core/pagination/interfaces/pagination-params.interface';
import { toPaginationQueryParams } from '../../../core/pagination/utils/pagination-utils';
import { AccountModel } from '../models/account.model';
import { UpdateAccountDataType } from '../types/api-accounts.types';

@Injectable({
  providedIn: 'root',
})
export class ApiAccountsTransformService {
  fromExtractAccounts(response: PaginatedResponseInterface<AccountInterface>): PaginatedResponse<AccountModel> {
    return new PaginatedResponse<AccountModel>(
      response.data.map((d) => this.toAccountModel(d)),
      response.meta
    );
  }

  toExtractAccountsParams(pagination?: PaginationParamsInterface) {
    return new HttpParams({
      fromObject: toPaginationQueryParams(pagination),
    });
  }

  toUpdateAccount({ name }: AccountModel): UpdateAccountDataType {
    return { name };
  }

  fromUpdateAccount(response: AccountInterface): AccountModel {
    return this.toAccountModel(response);
  }

  fromDeleteAccount(response: AccountInterface): AccountModel {
    return this.toAccountModel(response);
  }

  private toAccountModel(plain: AccountInterface): AccountModel {
    return plainToInstance(AccountModel, plain);
  }
}
