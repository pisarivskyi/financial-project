import { Injectable } from '@angular/core';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, finalize, tap } from 'rxjs';

import { PaginationInterface } from '../../../core/supabase/interfaces/pagination.interface';
import { PaginationModel } from '../../../core/supabase/models/pagination.model';
import {
  ApiInsertAccountRowData, ApiUpdateAccountRowData,
} from '../../../core/supabase/types/table.types';
import { UUID } from '../../../core/supabase/types/uuid.type';
import { Account } from '../../../api/accounts/models/account.model';
import { AccountsService } from '../../services/accounts.service';

@Injectable({
  providedIn: 'root',
})
export class AccountsFacadeService {
  private isLoadingSubject$ = new BehaviorSubject<boolean>(false);

  private accountsSubject$ = new BehaviorSubject<Account[]>([]);

  private paginationSubject$ = new BehaviorSubject<PaginationModel>(
    new PaginationModel({
      pageIndex: 1,
      pageSize: 20,
      total: 0,
    })
  );

  isLoading$ = this.isLoadingSubject$.asObservable();

  accounts$ = this.accountsSubject$.asObservable();

  pagination$ = this.paginationSubject$.asObservable();

  constructor(private accountsService: AccountsService) {}

  getAccounts(): void {
    this.isLoadingSubject$.next(true);

    this.accountsService
      .getAccounts$(this.paginationSubject$.value)
      .pipe(
        tap(({ data, count }) => {
          this.accountsSubject$.next(data ?? []);

          this.paginationSubject$.next(
            this.paginationSubject$.value.patch({
              total: count ?? this.paginationSubject$.value.total,
            })
          );
        }),
        finalize(() => this.isLoadingSubject$.next(false))
      )
      .subscribe();
  }

  saveAccount$(accountData: ApiInsertAccountRowData): Observable<PostgrestResponse<Account>> {
    return this.accountsService.saveAccount$(accountData);
  }

  deleteAccount$(id: UUID): Observable<PostgrestSingleResponse<null>> {
    return this.accountsService.deleteAccount$(id);
  }

  updateAccount$(id: UUID, accountData: ApiUpdateAccountRowData): Observable<PostgrestSingleResponse<null>> {
    return this.accountsService.updateAccount$(id, accountData);
  }

  updatePagination(pagination: Partial<PaginationInterface>): void {
    this.paginationSubject$.next(this.paginationSubject$.value.patch(pagination));
  }
}
