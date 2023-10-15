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

import { CurrencyEnum, PeriodEnum } from '@financial-project/common';

import { BudgetModel } from '../../../../api/budgets/models/budget.model';
import { CategoryModel } from '../../../../api/categories/models/category.model';
import { CURRENCY_OPTIONS } from '../../../../shared/constants/currency-options.const';
import { PERIOD_OPTIONS } from '../../../../shared/constants/period-options.const';
import { CreateFormGroupFromData } from '../../../../shared/types/create-form-group-from-data.type';
import { BudgetsFacadeService } from '../../services/budgets-facade.service';

export interface BudgetFormData {
  name: string;
  amount: number;
  categories: CategoryModel[];
  currencyCode: CurrencyEnum;
  period: PeriodEnum;
  color?: string;
  range?: Date[];
}

export type BudgetFormGroup = CreateFormGroupFromData<BudgetFormData>;

@UntilDestroy()
@Component({
  selector: 'fpd-budget-form',
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
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetFormComponent implements OnInit {
  @Input()
  budget = new BudgetModel();

  formGroup!: FormGroup;

  isLoading$ = new BehaviorSubject<boolean>(false);

  categoriesOptions$ = new BehaviorSubject<{ label: string; value: CategoryModel }[]>([]);

  readonly CURRENCY_OPTIONS = CURRENCY_OPTIONS;
  readonly PERIOD_OPTIONS = PERIOD_OPTIONS;

  constructor(private budgetsFacadeService: BudgetsFacadeService) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup<BudgetFormGroup>({
      name: new FormControl(this.budget.name, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      amount: new FormControl(this.fromCoins(this.budget.amount), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      categories: new FormControl(this.budget.categories, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      currencyCode: new FormControl(this.budget.currencyCode, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      period: new FormControl(this.budget.period, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      color: new FormControl(this.budget.color ?? '', {
        nonNullable: true,
      }),
      range: new FormControl(
        this.budget.fromDate && this.budget.toDate ? [this.budget.fromDate, this.budget.toDate] : [],
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
    });

    this.toggleRangeControl(this.budget.period);

    this.formGroup.controls['period'].valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((period: PeriodEnum) => this.toggleRangeControl(period));

    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading$.next(true);

    this.budgetsFacadeService
      .getAllCategories$()
      .pipe(
        untilDestroyed(this),
        finalize(() => this.isLoading$.next(false))
      )
      .subscribe((categories) =>
        this.categoriesOptions$.next(
          categories.map((category) => ({
            label: category.name,
            value: category,
          }))
        )
      );
  }

  getUpdatedModel(): BudgetModel {
    const { name, amount, categories, currencyCode, period, color, range } = this.formGroup.value;

    const budget = instanceToInstance(this.budget, { ignoreDecorators: true });
    budget.name = name;
    budget.amount = this.toCoins(amount);
    budget.categories = categories;
    budget.currencyCode = currencyCode;
    budget.period = period;
    budget.color = color;

    if (range?.length) {
      budget.fromDate = range[0];
      budget.toDate = range[1];
    }

    return budget;
  }

  compareWithFn = (o1: BudgetModel, o2: BudgetModel): boolean => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  private toggleRangeControl(period: PeriodEnum): void {
    if (period === PeriodEnum.OneTime) {
      this.formGroup.controls['range'].enable();
    } else {
      this.formGroup.controls['range'].disable();
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
