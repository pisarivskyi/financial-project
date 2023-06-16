import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, tap } from 'rxjs';

import { ApiExpansesService } from '../../../api/expanses/services/api-expanses.service';
import { ExpanseModel } from '../../../api/expanses/models/expanse.model';

@Injectable({
  providedIn: 'root'
})
export class ExpansesService {
  private isLoadingSubject$ = new BehaviorSubject<boolean>(false);

  private expansesSubject$ = new BehaviorSubject<ExpanseModel[]>([]);

  isLoading$ = this.isLoadingSubject$.asObservable();

  expanses$ = this.expansesSubject$.asObservable();

  constructor(private apiExpansesService: ApiExpansesService) { }

  getExpanses(): void {
    this.isLoadingSubject$.next(true);

    this.apiExpansesService.fetchExpanses()
      .pipe(
        tap(({ data }) => this.expansesSubject$.next(data ?? [])),
        finalize(() => this.isLoadingSubject$.next(false))
      )
      .subscribe();
  }
}
