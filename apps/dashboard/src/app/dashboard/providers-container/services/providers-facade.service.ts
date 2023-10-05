import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import { selectAllEntities, setEntities, withEntities } from '@ngneat/elf-entities';
import { getRequestResult, trackRequestResult } from '@ngneat/elf-requests';
import { Observable, map, switchMap, take, tap } from 'rxjs';

import { ProviderModel } from '../../../api/providers/models/provider.model';
import { updatePaginationData, withPaginationData } from '../../../core/pagination/utils/pagination-utils';
import { ProvidersService } from '../../services/providers.service';

@Injectable({
  providedIn: 'root',
})
export class ProvidersFacadeService {
  private readonly storyKey = 'providers';

  private readonly requestKeys = {
    getProviders: 'getProviders',
  };

  store = createStore({ name: this.storyKey }, withEntities<ProviderModel>(), withPaginationData());

  providers$ = this.store.pipe(selectAllEntities());

  pagination$ = this.store.pipe(map((s) => s.pagination));

  isLoading$ = getRequestResult([this.requestKeys.getProviders]).pipe(map(({ isLoading }) => isLoading));

  constructor(private providersService: ProvidersService) {}

  loadProviders(): void {
    this.store
      .pipe(
        take(1),
        switchMap(({ pagination }) => {
          return this.providersService.getProviders$(pagination);
        }),
        tap(({ data, meta }) => {
          this.store.update(setEntities(data), updatePaginationData(meta));
        }),
        trackRequestResult([this.requestKeys.getProviders], {
          skipCache: true,
        })
      )
      .subscribe();
  }

  saveProvider$(providerToSave: ProviderModel): Observable<ProviderModel> {
    return this.providersService.saveProvider$(providerToSave);
  }

  deleteProvider$(id: string): Observable<ProviderModel> {
    return this.providersService.deleteProvider$(id);
  }

  updateProvider$(providerToUpdate: ProviderModel): Observable<ProviderModel> {
    return this.providersService.updateProvider$(providerToUpdate);
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
