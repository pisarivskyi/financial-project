import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { instanceToInstance } from 'class-transformer';
import { BehaviorSubject, finalize } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { CurrencyEnum, PeriodEnum, RecordTypeEnum } from '@financial-project/common';

import { CategoryModel } from '../../../../api/categories/models/category.model';
import { PlannedPaymentModel } from '../../../../api/planned-payments/models/planned-payment.model';
import { CURRENCY_OPTIONS } from '../../../../shared/constants/currency-options.const';
import { DAY_OF_MONTH_OPTIONS } from '../../../../shared/constants/day-of-month-options.const';
import { DAY_OF_WEEK_OPTIONS } from '../../../../shared/constants/day-of-week-options.const';
import { PERIOD_OPTIONS } from '../../../../shared/constants/period-options.const';
import { RECORD_TYPE_OPTIONS } from '../../../../shared/constants/record-type-options.const';
import { CreateFormGroupFromData } from '../../../../shared/types/create-form-group-from-data.type';
import { PlannedPaymentsFacadeService } from '../../services/planned-payments-facade.service';

export interface PlannedPaymentFormData {
  name: string;
  color: string | null;
  icon: string | null;
  amount: number;
  category: CategoryModel;
  currencyCode: CurrencyEnum;
  type: RecordTypeEnum;
  period: PeriodEnum;
  dayOfWeek?: number | null;
  dayOfMonth?: number | null;
  dateOfYear?: Date | null;
}

export type PlannedPaymentFormGroup = CreateFormGroupFromData<PlannedPaymentFormData>;

@UntilDestroy()
@Component({
  selector: 'fpd-planned-payment-form',
  standalone: true,
  imports: [
    CommonModule,
    NzSelectModule,
    FormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    NzInputNumberModule,
    NzModalModule,
    NzSpinModule,
    NzIconModule,
    NzDatePickerModule,
  ],
  templateUrl: './planned-payment-form.component.html',
  styleUrls: ['./planned-payment-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlannedPaymentFormComponent implements OnInit {
  @Input()
  plannedPayment = new PlannedPaymentModel();

  formGroup!: FormGroup<PlannedPaymentFormGroup>;

  isLoading$ = new BehaviorSubject<boolean>(false);

  categoriesOptions$ = new BehaviorSubject<{ label: string; value: CategoryModel }[]>([]);

  readonly CURRENCY_OPTIONS = CURRENCY_OPTIONS;
  readonly PERIOD_OPTIONS = PERIOD_OPTIONS;
  readonly DAY_OF_MONTH_OPTIONS = DAY_OF_MONTH_OPTIONS;
  readonly DAY_OF_WEEK_OPTIONS = DAY_OF_WEEK_OPTIONS;
  readonly RECORD_TYPE_OPTIONS = RECORD_TYPE_OPTIONS;

  constructor(private budgetsFacadeService: PlannedPaymentsFacadeService) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup<PlannedPaymentFormGroup>({
      name: new FormControl(this.plannedPayment.name, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      amount: new FormControl(this.fromCoins(this.plannedPayment.amount), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      category: new FormControl(this.plannedPayment.category, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      currencyCode: new FormControl(this.plannedPayment.currencyCode, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      period: new FormControl(this.plannedPayment.period, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      color: new FormControl(this.plannedPayment.color ?? '', {
        nonNullable: true,
      }),
      icon: new FormControl(this.plannedPayment.icon),
      type: new FormControl(this.plannedPayment.type ?? '', {
        nonNullable: true,
      }),
      dateOfYear: new FormControl(this.plannedPayment.dateOfYear),
      dayOfMonth: new FormControl(this.plannedPayment.dayOfMonth),
      dayOfWeek: new FormControl(this.plannedPayment.dayOfWeek),
    });

    this.toggleDateControls(this.plannedPayment.period);

    this.formGroup.controls['period'].valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((period: PeriodEnum) => this.toggleDateControls(period));

    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading$.next(true);

    this.budgetsFacadeService
      .getAllCategories$()
      .pipe(
        untilDestroyed(this),
        finalize(() => this.isLoading$.next(false)),
      )
      .subscribe((categories) =>
        this.categoriesOptions$.next(
          categories.map((category) => ({
            label: category.name,
            value: category,
          })),
        ),
      );
  }

  getUpdatedModel(): PlannedPaymentModel {
    const { name, amount, category, currencyCode, period, type, dateOfYear, dayOfMonth, dayOfWeek } =
      this.formGroup.getRawValue();

    const budget = instanceToInstance(this.plannedPayment, { ignoreDecorators: true });
    budget.name = name;
    budget.amount = this.toCoins(amount);
    budget.category = category;
    budget.currencyCode = currencyCode;
    budget.period = period;
    budget.type = type;
    // budget.color = color;
    // budget.icon = icon;

    if (budget.period === PeriodEnum.OneTime || budget.period === PeriodEnum.Yearly) {
      budget.dateOfYear = dateOfYear!;
    } else if (budget.period === PeriodEnum.Monthly) {
      budget.dayOfMonth = dayOfMonth!;
    } else if (budget.period === PeriodEnum.Weekly) {
      budget.dayOfWeek = dayOfWeek!;
    }

    return budget;
  }

  compareWithFn = (o1: PlannedPaymentModel, o2: PlannedPaymentModel): boolean =>
    o1 && o2 ? o1.id === o2.id : o1 === o2;

  private toggleDateControls(period: PeriodEnum): void {
    this.formGroup.get('dayOfWeek')?.disable();
    this.formGroup.get('dateOfYear')?.disable();
    this.formGroup.get('dayOfMonth')?.disable();

    if (period === PeriodEnum.OneTime || period === PeriodEnum.Yearly) {
      this.formGroup.get('dateOfYear')?.enable();
    } else if (period === PeriodEnum.Weekly) {
      this.formGroup.get('dayOfWeek')?.enable();
    } else if (period === PeriodEnum.Monthly) {
      this.formGroup.get('dayOfMonth')?.enable();
    }
  }

  private toCoins(amount: number): number {
    return amount * 100;
  }

  private fromCoins(amount: number): number {
    const result = amount / 100;
    return isNaN(result) ? 1 : result;
  }
}
