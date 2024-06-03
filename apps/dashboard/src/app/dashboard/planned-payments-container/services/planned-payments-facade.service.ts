import { Injectable, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { createStore, select, setProp, withProps } from '@ngneat/elf';
import { selectAllEntities, setEntities, withEntities } from '@ngneat/elf-entities';
import { getRequestResult, trackRequestResult } from '@ngneat/elf-requests';
import { Observable, finalize, map, switchMap, take, tap } from 'rxjs';

import { CategoryModel } from '../../../api/categories/models/category.model';
import { PlannedPaymentModel } from '../../../api/planned-payments/models/planned-payment.model';
import { RoutePathEnum } from '../../../core/enums/route-path.enum';
import { updatePaginationData, withPaginationData } from '../../../core/pagination/utils/pagination-utils';
import { CategoriesService } from '../../services/categories.service';
import { PlannedPaymentsService } from '../../services/planned-payments.service';

export interface PlannedPaymentsProps {
  allPlannedPayments: PlannedPaymentModel[];
  isAllPlannedPaymentsLoading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PlannedPaymentsFacadeService {
  private readonly storyKey = 'plannedPayments';

  private readonly requestKeys = {
    getPlannedPayments: 'getPlannedPayments',
  };

  private plannedBudgetsService = inject(PlannedPaymentsService);
  private categoriesService = inject(CategoriesService);

  store = createStore(
    { name: this.storyKey },
    withEntities<PlannedPaymentModel>(),
    withPaginationData(),
    withProps<PlannedPaymentsProps>({
      isAllPlannedPaymentsLoading: false,
      allPlannedPayments: [],
    }),
  );

  plannedPayments$ = this.store.pipe(selectAllEntities());

  allPlannedPayments$ = this.store.pipe(select((state) => state.allPlannedPayments));

  pagination$ = this.store.pipe(map((s) => s.pagination));

  isLoading$ = getRequestResult([this.requestKeys.getPlannedPayments]).pipe(map(({ isLoading }) => isLoading));

  route = inject(ActivatedRoute);

  loadPlannedPayments(): void {
    this.store
      .pipe(
        take(1),
        switchMap(({ pagination }) => {
          return this.plannedBudgetsService.getPlannedPayments$(pagination);
        }),
        tap(({ data, meta }) => {
          this.store.update(setEntities(data), updatePaginationData(meta));
        }),
        trackRequestResult([this.requestKeys.getPlannedPayments], {
          skipCache: true,
        }),
      )
      .subscribe();
  }

  loadAllPlannedPayments(): void {
    this.store.update(setProp('isAllPlannedPaymentsLoading', true));

    this.getAllPlannedPayments$()
      .pipe(
        tap((payments) => {
          this.store.update(setProp('allPlannedPayments', payments));
        }),
        finalize(() => this.store.update(setProp('isAllPlannedPaymentsLoading', false))),
      )
      .subscribe();
  }

  reloadPlannedPayments(): void {
    let route = this.route;

    while (route.firstChild) {
      route = route.firstChild;
    }

    if (route.snapshot.routeConfig?.path === RoutePathEnum.Calendar) {
      this.loadAllPlannedPayments();
    } else {
      this.loadPlannedPayments();
    }
  }

  savePlannedPayment$(plannedPaymentToSave: PlannedPaymentModel): Observable<PlannedPaymentModel> {
    return this.plannedBudgetsService.savePlannedPayment$(plannedPaymentToSave);
  }

  deletePlannedPayment$(id: string): Observable<PlannedPaymentModel> {
    return this.plannedBudgetsService.deletePlannedPayment$(id);
  }

  updatePlannedPayment$(plannedPaymentToUpdate: PlannedPaymentModel): Observable<PlannedPaymentModel> {
    return this.plannedBudgetsService.updatePlannedPayment$(plannedPaymentToUpdate);
  }

  getAllPlannedPayments$(): Observable<PlannedPaymentModel[]> {
    return this.plannedBudgetsService.getPlannedPayments$().pipe(map((response) => response.data));
  }

  getAllCategories$(): Observable<CategoryModel[]> {
    return this.categoriesService.getCategories$().pipe(map((response) => response.data));
  }

  updatePagination(pageIndex: number, pageSize: number): void {
    this.store.update(
      updatePaginationData({
        pageIndex,
        pageSize,
      }),
    );
  }
}
