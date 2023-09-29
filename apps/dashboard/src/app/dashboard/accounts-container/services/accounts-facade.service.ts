import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import { selectAllEntities, setEntities, withEntities } from '@ngneat/elf-entities';
import { getRequestResult, trackRequestResult } from '@ngneat/elf-requests';
import { Observable, map, switchMap, take, tap } from 'rxjs';

import { AccountModel } from '../../../api/accounts/models/account.model';
import { updatePaginationData, withPaginationData } from '../../../core/pagination/utils/pagination-utils';
import { AccountsService } from '../../services/accounts.service';

@Injectable({
  providedIn: 'root',
})
export class AccountsFacadeService {
  private readonly storyKey = 'accounts';

  private readonly requestKeys = {
    getAccounts: 'getAccounts',
  };

  store = createStore({ name: this.storyKey }, withEntities<AccountModel>(), withPaginationData());

  isLoading$ = getRequestResult([this.requestKeys.getAccounts]).pipe(map(({ isLoading }) => isLoading));

  accounts$ = this.store.pipe(selectAllEntities());

  pagination$ = this.store.pipe(map((s) => s.pagination));

  constructor(private accountsService: AccountsService) {}

  loadAccounts(): void {
    this.store
      .pipe(
        take(1),
        switchMap(({ pagination }) => {
          return this.accountsService.getAccounts$(pagination);
        }),
        tap(({ data, meta }) => {
          this.store.update(setEntities(data), updatePaginationData(meta));
        }),
        trackRequestResult([this.requestKeys.getAccounts], {
          skipCache: true,
        })
      )
      .subscribe();
  }
  deleteAccount$(id: string): Observable<AccountModel> {
    return this.accountsService.deleteAccount$(id);
  }

  updateAccount$(accountToUpdate: AccountModel): Observable<AccountModel> {
    return this.accountsService.updateAccount$(accountToUpdate);
  }

  updatePagination(pageIndex: number, pageSize: number): void {
    this.store.update(
      updatePaginationData({
        pageIndex,
        pageSize,
      })
    );
  }
}
