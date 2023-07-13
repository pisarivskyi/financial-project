import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, tap } from 'rxjs';

import { ExpanseCategory } from '../../../api/expanse-categories/models/expanse-category.model';
import { ExpanseCategoriesService } from '../../services/expanse-categories.service';

@Injectable({
  providedIn: 'root',
})
export class ExpanseCategoriesFacadeService {
  private isLoadingSubject$ = new BehaviorSubject<boolean>(false);

  private expanseCategoriesSubject$ = new BehaviorSubject<ExpanseCategory[]>([]);

  isLoading$ = this.isLoadingSubject$.asObservable();

  expanseCategories$ = this.expanseCategoriesSubject$.asObservable();

  constructor(private expanseCategoriesService: ExpanseCategoriesService) {}

  getExpanseCategories(): void {
    this.isLoadingSubject$.next(true);

    this.expanseCategoriesService
      .getExpanseCategories()
      .pipe(
        tap(({ data }) => this.expanseCategoriesSubject$.next(data ?? [])),
        finalize(() => this.isLoadingSubject$.next(false))
      )
      .subscribe();
  }
}
