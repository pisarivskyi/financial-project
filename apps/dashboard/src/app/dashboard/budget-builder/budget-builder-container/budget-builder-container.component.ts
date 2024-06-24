import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';

import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';

import { RecordTypeEnum } from '@financial-project/common';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PERIOD_TO_LABEL } from '../../../shared/constants/period-to-label.const';
import { AmountFormatPipe } from '../../../shared/pipes/amount-format/amount-format.pipe';
import { ToDefaultCurrencyPipe } from '../../../shared/pipes/to-default-currency/to-default-currency.pipe';
import { BudgetBuilderFacadeService } from './services/budget-builder-facade.service';

@Component({
  selector: 'fpd-budget-builder-container',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    NzDatePickerComponent,
    NzFormModule,
    ReactiveFormsModule,
    NzButtonComponent,
    NzTableModule,
    ToDefaultCurrencyPipe,
    AmountFormatPipe,
  ],
  templateUrl: './budget-builder-container.component.html',
  styleUrl: './budget-builder-container.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetBuilderContainerComponent implements OnDestroy {
  budgetBuilderFacadeService = inject(BudgetBuilderFacadeService);

  readonly PERIOD_TO_LABEL = PERIOD_TO_LABEL;

  monthControl = new FormControl<Date>(new Date(), { nonNullable: true });

  isLoading$ = this.budgetBuilderFacadeService.isLoading$;
  initialized$ = this.budgetBuilderFacadeService.initialized$;
  budgets$ = this.budgetBuilderFacadeService.budgets$;
  plannedIncomePayments$ = this.budgetBuilderFacadeService.plannedPayments$.pipe(
    map((plannedPayments) => plannedPayments.filter((plannedPayment) => plannedPayment.type === RecordTypeEnum.Income)),
  );
  plannedOutcomePayments$ = this.budgetBuilderFacadeService.plannedPayments$.pipe(
    map((plannedPayments) =>
      plannedPayments.filter((plannedPayment) => plannedPayment.type === RecordTypeEnum.Outcome),
    ),
  );
  summary$ = this.budgetBuilderFacadeService.summary$;

  ngOnDestroy(): void {
    this.budgetBuilderFacadeService.reset();
  }

  onGenerate(): void {
    this.budgetBuilderFacadeService.setDate(this.monthControl.value);

    this.budgetBuilderFacadeService.loadData();
  }
}
