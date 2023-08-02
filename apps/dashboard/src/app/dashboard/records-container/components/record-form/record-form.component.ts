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

import { Category } from '../../../../api/categories/models/category.model';
import { RecordModel } from '../../../../api/records/models/record.model';
import { AuthenticationService } from '../../../../core/authentication/services/authentication.service';
import { CURRENCY_OPTIONS } from '../../../../shared/constants/currency-options.const';
import { CurrencyEnum } from '../../../../shared/enums/currency.enum';
import { CreateFormGroupFromData } from '../../../../shared/types/create-form-group-from-data.type';
import { CategoriesFacadeService } from '../../../categories-container/services/categories-facade.service';
import { RecordsFacadeService } from '../../services/records-facade.service';

export interface RecordFormData {
  name: string;
  amount: number;
  currencyCode: CurrencyEnum;
  category: Category | null;
}

export type RecordFormGroup = CreateFormGroupFromData<RecordFormData>;

@Component({
  selector: 'fpd-record-form',
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
  templateUrl: './record-form.component.html',
  styleUrls: ['./record-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordFormComponent implements OnInit {
  @Input()
  record: RecordModel | null = null;

  categoriesOptions$ = this.categoriesFacadeService.categories$.pipe(
    map((categories) =>
      categories.map((category) => ({
        label: category.name,
        value: category,
      }))
    )
  );

  isLoading$ = this.categoriesFacadeService.isLoading$;

  formGroup!: FormGroup;

  currencyOptions = CURRENCY_OPTIONS;

  constructor(
    private authService: AuthenticationService,
    private recordsFacadeService: RecordsFacadeService,
    private categoriesFacadeService: CategoriesFacadeService
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup<RecordFormGroup>({
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

    if (this.record) {
      this.formGroup.setValue({
        name: this.record.name,
        amount: this.record.amount,
        currencyCode: this.record.currencyCode,
        category: this.record.category,
      });
    }

    this.categoriesFacadeService.getCategories();
  }

  compareWithFn = (o1: Category, o2: Category): boolean => (o1 && o2 ? o1.id === o2.id : o1 === o2);
}
