import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';

import { ExpanseModel } from '../../../api/expanses/models/expanse.model';
import { ApiInsertExpanseRowData, ApiUpdateExpanseRowData } from '../../../core/supabase/types/table.types';
import { ExpansesService } from '../../services/expanses.service';
import { UUID } from '../../../core/supabase/types/uuid.type';

@Injectable({
  providedIn: 'root'
})
export class ExpansesFacadeService {
  private isLoadingSubject$ = new BehaviorSubject<boolean>(false);

  private expansesSubject$ = new BehaviorSubject<ExpanseModel[]>([]);

  isLoading$ = this.isLoadingSubject$.asObservable();

  expanses$ = this.expansesSubject$.asObservable();

  constructor(private expansesService: ExpansesService) { }

  getExpanses(): void {
    this.isLoadingSubject$.next(true);

    this.expansesService.getExpanses()
      .pipe(
        tap(({ data }) => this.expansesSubject$.next(data ?? [])),
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
}
