import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, tap } from 'rxjs';

import { ApiExpanseCategoriesService } from '../../../api/expanse-categories/services/api-expanse-categories.service';
import { ExpanseCategory } from '../../../api/expanse-categories/models/expanse-category.model';

@Injectable({
  providedIn: 'root'
})
export class ExpanseCategoriesService {
  private isLoadingSubject$ = new BehaviorSubject<boolean>(false);

  private expanseCategoriesSubject$ = new BehaviorSubject<ExpanseCategory[]>([]);

  isLoading$ = this.isLoadingSubject$.asObservable();

  expanseCategories$ = this.expanseCategoriesSubject$.asObservable();

  constructor(private apiExpanseCategoriesService: ApiExpanseCategoriesService) { }

  getExpanseCategories(): void {
    this.isLoadingSubject$.next(true);

    this.apiExpanseCategoriesService.fetchExpanseCategories()
      .pipe(
        tap(({ data }) => this.expanseCategoriesSubject$.next(data ?? [])),
        finalize(() => this.isLoadingSubject$.next(false))
      )
      .subscribe();
  }
}
