import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { map } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { ExpanseCategory } from '../../../../api/expanse-categories/models/expanse-category.model';
import { ExpanseModel } from '../../../../api/expanses/models/expanse.model';
import { AuthenticationService } from '../../../../core/authentication/services/authentication.service';
import { CURRENCY_OPTIONS } from '../../../../shared/constants/currency-options.const';
import { CurrencyEnum } from '../../../../shared/enums/currency.enum';
import { CreateFormGroupFromData } from '../../../../shared/types/create-form-group-from-data.type';
import { ExpanseCategoriesFacadeService } from '../../../expanse-categories-container/services/expanse-categories-facade.service';
import { ExpansesFacadeService } from '../../services/expanses-facade.service';

export interface ExpanseFormData {
  name: string;
  amount: number;
  currencyCode: CurrencyEnum;
  category: ExpanseCategory | null;
}

export type ExpanseFormGroup = CreateFormGroupFromData<ExpanseFormData>;

@Component({
  selector: 'fpd-expanse-form',
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
  ],
  templateUrl: './expanse-form.component.html',
  styleUrls: ['./expanse-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpanseFormComponent implements OnInit {
  @Input()
  expanse: ExpanseModel | null = null;

  expanseCategoriesOptions$ = this.expanseCategoriesService.expanseCategories$.pipe(
    map((expanseCategories) =>
      expanseCategories.map((expanseCategory) => ({
        label: expanseCategory.name,
        value: expanseCategory,
      }))
    )
  );

  isLoading$ = this.expanseCategoriesService.isLoading$;

  formGroup!: FormGroup;

  currencyOptions = CURRENCY_OPTIONS;

  constructor(
    private authService: AuthenticationService,
    private expanseService: ExpansesFacadeService,
    private expanseCategoriesService: ExpanseCategoriesFacadeService
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup<ExpanseFormGroup>({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      amount: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      currencyCode: new FormControl(CurrencyEnum.EUR, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      category: new FormControl(null, {
        validators: [Validators.required],
      }),
    });

    if (this.expanse) {
      this.formGroup.setValue({
        name: this.expanse.name,
        amount: this.expanse.amount,
        currencyCode: this.expanse.currencyCode,
        category: this.expanse.category,
      });
    }

    this.expanseCategoriesService.getExpanseCategories();
  }

  compareWithFn = (o1: ExpanseCategory, o2: ExpanseCategory): boolean => (o1 && o2 ? o1.id === o2.id : o1 === o2);
}
