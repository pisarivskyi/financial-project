import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';

import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';

import { CurrencyEnum, RecordTypeEnum } from '@financial-project/common';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PERIOD_TO_LABEL } from '../../../shared/constants/period-to-label.const';
import { AmountFormatPipe } from '../../../shared/pipes/amount-format/amount-format.pipe';
import { ToDefaultCurrencyPipe } from '../../../shared/pipes/to-default-currency/to-default-currency.pipe';
import { SettingsService } from '../../services/settings.service';
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
export class BudgetBuilderContainerComponent implements OnInit, OnDestroy {
  private budgetBuilderFacadeService = inject(BudgetBuilderFacadeService);
  private settingsService = inject(SettingsService);

  defaultCurrencyCode = signal<CurrencyEnum>(CurrencyEnum.UAH);

  monthControl = new FormControl<Date>(new Date(), { nonNullable: true });

  isLoading$ = this.budgetBuilderFacadeService.isLoading$;
  initialized$ = this.budgetBuilderFacadeService.initialized$;
  budgets$ = this.budgetBuilderFacadeService.budgets$;
  plannedPayments$ = this.budgetBuilderFacadeService.plannedPayments$.pipe(
    map((plannedPayments) =>
      plannedPayments.sort((a, b) => a.id.localeCompare(b.id)).sort((a) => (a.type === RecordTypeEnum.Income ? -1 : 1)),
    ),
  );
  summary$ = this.budgetBuilderFacadeService.summary$;

  readonly PERIOD_TO_LABEL = PERIOD_TO_LABEL;
  readonly RecordTypeEnum = RecordTypeEnum;

  ngOnInit(): void {
    this.defaultCurrencyCode.set(this.settingsService.getSettingsSync().defaultCurrencyCode);
  }

  ngOnDestroy(): void {
    this.budgetBuilderFacadeService.reset();
  }

  onGenerate(): void {
    this.budgetBuilderFacadeService.setDate(this.monthControl.value);

    this.budgetBuilderFacadeService.loadData();
  }

  onAddBudget(): void {
    this.budgetBuilderFacadeService.addBudget();
  }

  onAddPlannedPayment(): void {
    this.budgetBuilderFacadeService.addPlannedPayment();
  }

  // onSave(): void {}
}
