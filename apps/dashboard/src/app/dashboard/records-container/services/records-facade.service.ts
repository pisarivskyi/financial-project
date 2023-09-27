import { Injectable } from '@angular/core';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, finalize, tap } from 'rxjs';

import { RecordModel } from '../../../api/records/models/record.model';
import { PaginationInterface } from '../../../core/supabase/interfaces/pagination.interface';
import { PaginationModel } from '../../../core/pagination/pagination.model';
import { ApiInsertRecordRowData, ApiUpdateRecordRowData } from '../../../core/supabase/types/table.types';
import { UUID } from '../../../core/supabase/types/uuid.type';
import { RecordsService } from '../../services/records.service';

@Injectable({
  providedIn: 'root',
})
export class RecordsFacadeService {
  private isLoadingSubject$ = new BehaviorSubject<boolean>(false);

  private recordsSubject$ = new BehaviorSubject<RecordModel[]>([]);

  private paginationSubject$ = new BehaviorSubject<PaginationModel>(
    new PaginationModel({
      pageIndex: 1,
      pageSize: 20,
      total: 0,
    })
  );

  isLoading$ = this.isLoadingSubject$.asObservable();

  records$ = this.recordsSubject$.asObservable();

  pagination$ = this.paginationSubject$.asObservable();

  constructor(private recordsService: RecordsService) {}

  getRecords(): void {
    this.isLoadingSubject$.next(true);

    this.recordsService
      .getRecords$(this.paginationSubject$.value)
      .pipe(
        tap(({ data, count }) => {
          this.recordsSubject$.next(data ?? []);

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

  saveRecord$(recordData: ApiInsertRecordRowData): Observable<PostgrestResponse<RecordModel>> {
    return this.recordsService.saveRecord$(recordData);
  }

  deleteRecord$(id: UUID): Observable<PostgrestSingleResponse<null>> {
    return this.recordsService.deleteRecord$(id);
  }

  updateRecord$(id: UUID, recordData: ApiUpdateRecordRowData): Observable<PostgrestSingleResponse<null>> {
    return this.recordsService.updateRecord$(id, recordData);
  }

  updatePagination(pagination: Partial<PaginationInterface>): void {
    this.paginationSubject$.next(this.paginationSubject$.value.patch(pagination));
  }
}
