import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import { selectAllEntities, setEntities, withEntities } from '@ngneat/elf-entities';
import { getRequestResult, trackRequestResult } from '@ngneat/elf-requests';
import { Observable, map, switchMap, take, tap } from 'rxjs';

import { RecordModel } from '../../../api/records/models/record.model';
import { updatePaginationData, withPaginationData } from '../../../core/pagination/utils/pagination-utils';
import { RecordsService } from '../../services/records.service';

@Injectable({
  providedIn: 'root',
})
export class RecordsFacadeService {
  private readonly storyKey = 'records';

  private readonly requestKeys = {
    getRecords: 'getRecords',
  };

  store = createStore({ name: this.storyKey }, withEntities<RecordModel>(), withPaginationData());

  records$ = this.store.pipe(selectAllEntities());

  pagination$ = this.store.pipe(map((s) => s.pagination));

  isLoading$ = getRequestResult([this.requestKeys.getRecords]).pipe(map(({ isLoading }) => isLoading));

  constructor(private recordsService: RecordsService) {}

  getRecords(): void {
    this.store
      .pipe(
        take(1),
        switchMap(({ pagination }) => {
          return this.recordsService.getRecords$(pagination);
        }),
        tap(({ data, meta }) => {
          this.store.update(setEntities(data), updatePaginationData(meta));
        }),
        trackRequestResult([this.requestKeys.getRecords], {
          skipCache: true,
        })
      )
      .subscribe();
  }

  updateRecord$(recordToUpdate: RecordModel): Observable<RecordModel> {
    return this.recordsService.updateRecord$(recordToUpdate);
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
