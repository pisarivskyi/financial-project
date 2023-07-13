import { Injectable } from '@angular/core';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, finalize, tap } from 'rxjs';

import { ExpanseModel } from '../../../api/expanses/models/expanse.model';
import { PaginationInterface } from '../../../core/supabase/interfaces/pagination.interface';
import { PaginationModel } from '../../../core/supabase/models/pagination.model';
import { ApiInsertExpanseRowData, ApiUpdateExpanseRowData } from '../../../core/supabase/types/table.types';
import { UUID } from '../../../core/supabase/types/uuid.type';
import { ExpansesService } from '../../services/expanses.service';

@Injectable({
  providedIn: 'root',
})
export class ExpansesFacadeService {
  private isLoadingSubject$ = new BehaviorSubject<boolean>(false);

  private expansesSubject$ = new BehaviorSubject<ExpanseModel[]>([]);

  private paginationSubject$ = new BehaviorSubject<PaginationModel>(
    new PaginationModel({
      pageIndex: 1,
      pageSize: 20,
      total: 0,
    })
  );

  isLoading$ = this.isLoadingSubject$.asObservable();

  expanses$ = this.expansesSubject$.asObservable();

  pagination$ = this.paginationSubject$.asObservable();

  constructor(private expansesService: ExpansesService) {}

  getExpanses(): void {
    this.isLoadingSubject$.next(true);

    this.expansesService
      .getExpanses(this.paginationSubject$.value)
      .pipe(
        tap(({ data, count }) => {
          this.expansesSubject$.next(data ?? []);

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

  saveExpanse(expanse: ApiInsertExpanseRowData): Observable<PostgrestResponse<ExpanseModel>> {
    return this.expansesService.saveExpanse(expanse);
  }

  deleteExpanse(id: UUID): Observable<PostgrestSingleResponse<null>> {
    return this.expansesService.deleteExpanse(id);
  }

  updateExpanse(id: UUID, expanse: ApiUpdateExpanseRowData): Observable<PostgrestSingleResponse<null>> {
    return this.expansesService.updateExpanse(id, expanse);
  }

  updatePagination(pagination: Partial<PaginationInterface>): void {
    this.paginationSubject$.next(this.paginationSubject$.value.patch(pagination));
  }
}
