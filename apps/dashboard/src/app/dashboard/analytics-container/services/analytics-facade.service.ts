import { Injectable, inject } from '@angular/core';
import { createStore, setProps, withProps } from '@ngneat/elf';
import { getRequestResult } from '@ngneat/elf-requests';
import { Observable, forkJoin, map, of, switchMap, take, tap } from 'rxjs';

import { AccountModel } from '../../../api/accounts/models/account.model';
import { SummaryModel } from '../../../api/analytics/models/summary.model';
import { CategoryModel } from '../../../api/categories/models/category.model';
import { SettingsModel } from '../../../api/settings/models/settings.model';
import { AccountsService } from '../../services/accounts.service';
import { AnalyticsService } from '../../services/analytics.service';
import { CategoriesService } from '../../services/categories.service';
import { SettingsService } from '../../services/settings.service';

export interface AnalyticsFiltersInterface {
  fromDate: Date;
  toDate: Date;
  prevFromDate: Date;
  prevToDate: Date;
  selectedAccounts: AccountModel[];
}

export interface AnalyticsStatePropsInterface {
  filters: AnalyticsFiltersInterface;
  categories: CategoryModel[];
  accounts: AccountModel[];
  settings: SettingsModel | null;
  summary: SummaryModel | null;
  prevSummary: SummaryModel | null;
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsFacadeService {
  private readonly storyKey = 'analytics';

  private readonly requestKeys = {
    initialize: 'initialize',
  };

  store = createStore(
    { name: this.storyKey },
    withProps<AnalyticsStatePropsInterface>({
      filters: {
        selectedAccounts: [],
        fromDate: new Date(),
        toDate: new Date(),
        prevFromDate: new Date(),
        prevToDate: new Date(),
      },
      categories: [],
      accounts: [],
      settings: null,
      summary: null,
      prevSummary: null,
    })
  );

  accounts$ = this.store.pipe(map((state) => state.accounts));
  summary$ = this.store.pipe(map((state) => state.summary));
  prevSummary$ = this.store.pipe(map((state) => state.prevSummary));
  settings$ = this.store.pipe(map((state) => state.settings));
  filters$ = this.store.pipe(map((state) => state.filters));

  isLoading$ = getRequestResult([this.requestKeys.initialize]).pipe(map(({ isLoading }) => isLoading));

  private analyticsService = inject(AnalyticsService);
  private categoriesService = inject(CategoriesService);
  private accountsService = inject(AccountsService);
  private settingsService = inject(SettingsService);

  initialize(): void {
    forkJoin([
      this.categoriesService.getCategories$().pipe(map((response) => response.data)),
      this.accountsService.getAccounts$().pipe(map((response) => response.data)),
      this.settingsService.getSettings$(),
    ])
      .pipe(
        tap(([categories, accounts, settings]) => {
          this.store.update(
            setProps({
              categories,
              accounts,
              settings,
            })
          );
        })
      )
      .subscribe(() => this.loadSummary());
  }

  loadSummary(): void {
    this.store
      .pipe(
        take(1),
        switchMap(({ settings, filters: { selectedAccounts, fromDate, toDate, prevFromDate, prevToDate } }) => {
          if (settings && selectedAccounts.length) {
            return forkJoin([
              this.getSummary$(fromDate, toDate, selectedAccounts),
              this.getSummary$(prevFromDate, prevToDate, selectedAccounts),
            ]);
          }

          return of([null, null]);
        })
      )
      .subscribe(([summary, prevSummary]) => {
        this.store.update(
          setProps({
            summary,
            prevSummary,
          })
        );
      });
  }

  getSummary$(fromDate: Date, toDate: Date, accounts: AccountModel[]): Observable<SummaryModel> {
    return this.analyticsService.getSummary$(fromDate, toDate, accounts);
  }

  setSelectedAccounts(accounts: AccountModel[]): void {
    this.store.update(
      setProps((state) => ({
        ...state,
        filters: {
          ...state.filters,
          selectedAccounts: accounts,
        },
      }))
    );
  }

  setDateRange(fromDate: Date, toDate: Date, prevFromDate: Date, prevToDate: Date): void {
    this.store.update(
      setProps((state) => ({
        ...state,
        filters: {
          ...state.filters,
          fromDate,
          toDate,
          prevFromDate,
          prevToDate,
        },
      }))
    );
  }
}
