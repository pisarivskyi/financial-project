import { Injectable, inject } from '@angular/core';
import { createStore, select, setProp, setProps, withProps } from '@ngneat/elf';
import { getRequestResult, trackRequestResult } from '@ngneat/elf-requests';
import { instanceToInstance, plainToClassFromExist } from 'class-transformer';
import { DateTime } from 'luxon';
import { forkJoin, map, switchMap, take, tap } from 'rxjs';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { PeriodEnum, RecordTypeEnum } from '@financial-project/common';

import { BudgetPlanModel } from '../../../../api/budget-plans/models/budget-plan.model';
import { BudgetSnapshotModel } from '../../../../api/budget-snapshots/models/budget-snapshot.model';
import { BudgetModel } from '../../../../api/budgets/models/budget.model';
import { PlannedPaymentSnapshotModel } from '../../../../api/planned-payment-snapshots/models/planned-payment-snapshot.model';
import { PlannedPaymentModel } from '../../../../api/planned-payments/models/planned-payment.model';
import { AddBudgetModalComponent } from '../../../budgets-container/components/add-budget-modal/add-budget-modal.component';
import { AddPlannedPaymentModalComponent } from '../../../planned-payments-container/components/add-planned-payment-modal/add-planned-payment-modal.component';
import { BudgetPlansService } from '../../../services/budget-plans.service';
import { BudgetSnapshotsService } from '../../../services/budget-snapshots.service';
import { BudgetsService } from '../../../services/budgets.service';
import { CurrencyRatesService } from '../../../services/currency-rates.service';
import { PlannedPaymentSnapshotsService } from '../../../services/planned-payment-snapshots.service';
import { PlannedPaymentsHelpersService } from '../../../services/planned-payments-helpers.service';
import { PlannedPaymentsService } from '../../../services/planned-payments.service';
import { SettingsService } from '../../../services/settings.service';

export interface BudgetBuilderStatePropsInterface {
  initialized: boolean;
  selectedDate: Date;
  budgets: BudgetModel[];
  plannedPayments: PlannedPaymentModel[];
  summary: {
    outcome: number;
    income: number;
    difference: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class BudgetBuilderFacadeService {
  private readonly storyKey = 'budget-builder';

  private readonly requestKeys = {
    initialize: 'initialize',
    saveBudgetPlan: 'saveBudgetPlan',
  };

  private store = createStore(
    { name: this.storyKey },
    withProps<BudgetBuilderStatePropsInterface>({
      initialized: false,
      selectedDate: new Date(),
      budgets: [],
      plannedPayments: [],
      summary: {
        outcome: 0,
        income: 0,
        difference: 0,
      },
    }),
  );

  isLoading$ = getRequestResult([this.requestKeys.initialize]).pipe(map(({ isLoading }) => isLoading));
  selectedDate$ = this.store.pipe(select((state) => state.selectedDate));
  budgets$ = this.store.pipe(select((state) => state.budgets));
  plannedPayments$ = this.store.pipe(select((state) => state.plannedPayments));
  initialized$ = this.store.pipe(select((state) => state.initialized));
  summary$ = this.store.pipe(select((state) => state.summary));

  private settingService = inject(SettingsService);
  private currencyRatesService = inject(CurrencyRatesService);
  private budgetsService = inject(BudgetsService);
  private plannedPaymentsService = inject(PlannedPaymentsService);
  private plannedPaymentsHelpersService = inject(PlannedPaymentsHelpersService);

  private modalService = inject(NzModalService);
  private messageService = inject(NzMessageService);

  private budgetPlansService = inject(BudgetPlansService);

  private budgetSnapshotsService = inject(BudgetSnapshotsService);
  private plannedPaymentSnapshotsService = inject(PlannedPaymentSnapshotsService);

  setDate(date: Date): void {
    this.store.update(setProp('selectedDate', date));
  }

  loadData(): void {
    this.store.update(setProp('initialized', true));

    forkJoin([
      this.budgetsService.getBudgets$().pipe(map((resp) => resp.data)),
      this.plannedPaymentsService.getPlannedPayments$().pipe(map((resp) => resp.data)),
      this.selectedDate$.pipe(take(1)),
      this.settingService.getSettingsFromCache$(),
    ])
      .pipe(
        trackRequestResult([this.requestKeys.initialize], {
          skipCache: true,
        }),
      )
      .subscribe(([budgets, plannedPayments, selectedDate, settings]) => {
        // get selected billing period start and end dates
        const currentDt = DateTime.fromJSDate(selectedDate);
        let startOfCurrentBillingPeriod = currentDt.startOf('month').set({ day: settings.billingPeriodStartDayNumber });
        const endOfCurrentBillingPeriod = startOfCurrentBillingPeriod.plus({ month: 1 }).minus({ day: 1 });
        const weeksInPaymentPeriod = endOfCurrentBillingPeriod.weekNumber - startOfCurrentBillingPeriod.weekNumber;

        // process planned payments
        const processedPayments = this.plannedPaymentsHelpersService.processPlannedPayments(plannedPayments);

        const plannedPaymentsForSelectedPeriod: PlannedPaymentModel[] = [];

        // collect all planned payments for the selected period
        do {
          plannedPaymentsForSelectedPeriod.push(
            ...this.plannedPaymentsHelpersService.getPlannedPaymentsForDate(
              processedPayments,
              startOfCurrentBillingPeriod.toJSDate(),
            ),
          );

          startOfCurrentBillingPeriod = startOfCurrentBillingPeriod.plus({ day: 1 });
        } while (startOfCurrentBillingPeriod <= endOfCurrentBillingPeriod);

        const plannedOutcome = plannedPaymentsForSelectedPeriod
          .filter((plannedPayment) => plannedPayment.type === RecordTypeEnum.Outcome)
          .reduce(
            (acc, plannedPayment) =>
              acc +
              this.currencyRatesService.convert(
                plannedPayment.amount,
                plannedPayment.currencyCode,
                settings.defaultCurrencyCode,
              ),
            0,
          );

        const plannedIncome = plannedPaymentsForSelectedPeriod
          .filter((plannedPayment) => plannedPayment.type === RecordTypeEnum.Income)
          .reduce(
            (acc, plannedPayment) =>
              acc +
              this.currencyRatesService.convert(
                plannedPayment.amount,
                plannedPayment.currencyCode,
                settings.defaultCurrencyCode,
              ),
            0,
          );

        const monthlyBudget = budgets
          .filter((budget) => budget.period === PeriodEnum.Monthly)
          .reduce(
            (acc, budget) =>
              acc + this.currencyRatesService.convert(budget.amount, budget.currencyCode, settings.defaultCurrencyCode),
            0,
          );

        const weeklyBudget = budgets
          .filter((budget) => budget.period === PeriodEnum.Weekly)
          .reduce(
            (acc, budget) =>
              acc + this.currencyRatesService.convert(budget.amount, budget.currencyCode, settings.defaultCurrencyCode),
            0,
          );

        const totalOutcome = weeklyBudget * weeksInPaymentPeriod + monthlyBudget + plannedOutcome;

        this.store.update(
          setProps({
            budgets,
            plannedPayments: plannedPaymentsForSelectedPeriod,
            summary: {
              outcome: totalOutcome,
              income: plannedIncome,
              difference: plannedIncome - totalOutcome,
            },
          }),
        );
      });
  }

  addBudget(): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Add new budget',
      nzContent: AddBudgetModalComponent,
      nzCentered: true,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.loadData();

        this.messageService.success('Budget was created');
      }
    });
  }

  addPlannedPayment(): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Add new planned payment',
      nzContent: AddPlannedPaymentModalComponent,
      nzCentered: true,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.loadData();

        this.messageService.success('Planned payment was created');
      }
    });
  }

  saveBudgetPlan(): void {
    console.log('saving...');

    this.store
      .pipe(
        take(1),
        select(({ selectedDate, budgets, plannedPayments }) => ({ selectedDate, budgets, plannedPayments })),
        switchMap(({ selectedDate, budgets, plannedPayments }) => {
          return forkJoin([
            forkJoin([
              ...budgets.map((budget) => {
                const budgetSnapshot = plainToClassFromExist(new BudgetSnapshotModel(), budget);
                // budgetSnapshot.budgetPlan = budgetPlan;

                console.log(budgetSnapshot);

                return this.budgetSnapshotsService.saveBudgetSnapshot$(budget);
              }),
            ]),
            forkJoin([
              ...plannedPayments
                .reduce<PlannedPaymentModel[]>((acc, item) => {
                  if (acc.find((i) => i.id === item.id)) {
                    return acc;
                  }

                  acc.push(item);

                  return acc;
                }, [])
                .map((plannedPayment) => {
                  const plannedPaymentSnapshot = plainToClassFromExist(
                    new PlannedPaymentSnapshotModel(),
                    plannedPayment,
                  );
                  // plannedPaymentSnapshot.budgetPlan = budgetPlan;

                  console.log(plannedPaymentSnapshot);

                  return this.plannedPaymentSnapshotsService.savePlannedPaymentSnapshot$(plannedPaymentSnapshot);
                }),
            ]),
          ]).pipe(
            switchMap(([budgetSnapshots, plannedPaymentSnapshots]) => {
              const budgetPlan = new BudgetPlanModel();
              budgetPlan.month = selectedDate.getMonth() + 1;
              budgetPlan.year = selectedDate.getFullYear();
              budgetPlan.budgetSnapshots = budgetSnapshots;
              budgetPlan.plannedPaymentSnapshots = plannedPaymentSnapshots;

              return this.budgetPlansService.saveBudgetPlan$(budgetPlan);
            }),
          );

          // return this.budgetPlansService.saveBudgetPlan$(budgetPlan).pipe(
          //   switchMap((budgetPlan) =>
          //     forkJoin([
          //       forkJoin([
          //         ...budgets.map((budget) => {
          //           const budgetSnapshot = plainToClassFromExist(new BudgetSnapshotModel(), budget);
          //           budgetSnapshot.budgetPlan = budgetPlan;
          //
          //           console.log(budgetSnapshot);
          //
          //           return this.budgetSnapshotsService.saveBudgetSnapshot$(budget);
          //         }),
          //       ]).pipe(tap((budgetSnapshots) => budgetPlan.budgetSnapshots)),
          //       forkJoin([
          //         ...plannedPayments
          //           .reduce<PlannedPaymentModel[]>((acc, item) => {
          //             if (acc.find((i) => i.id === item.id)) {
          //               return acc;
          //             }
          //
          //             acc.push(item);
          //
          //             return acc;
          //           }, [])
          //           .map((plannedPayment) => {
          //             const plannedPaymentSnapshot = plainToClassFromExist(
          //               new PlannedPaymentSnapshotModel(),
          //               plannedPayment,
          //             );
          //             plannedPaymentSnapshot.budgetPlan = budgetPlan;
          //
          //             console.log(plannedPaymentSnapshot);
          //
          //             return this.plannedPaymentSnapshotsService.savePlannedPaymentSnapshot$(plannedPaymentSnapshot);
          //           }),
          //       ]),
          //     ]),
          //   ),
          // );
        }),
      )
      .subscribe();
  }

  reset(): void {
    this.store.reset();
  }
}
