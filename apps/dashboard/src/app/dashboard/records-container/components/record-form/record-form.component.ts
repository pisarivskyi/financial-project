import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { instanceToInstance } from 'class-transformer';
import { BehaviorSubject, finalize } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { CategoryModel } from '../../../../api/categories/models/category.model';
import { RecordModel } from '../../../../api/records/models/record.model';
import { CreateFormGroupFromData } from '../../../../shared/types/create-form-group-from-data.type';
import { CategoriesFacadeService } from '../../../categories-container/services/categories-facade.service';
import { RecordsFacadeService } from '../../services/records-facade.service';

export interface RecordFormData {
  name: string;
  comment: string;
  category: CategoryModel | null;
}

export type RecordFormGroup = CreateFormGroupFromData<RecordFormData>;

@UntilDestroy()
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
  record = new RecordModel();

  isLoading$ = new BehaviorSubject<boolean>(false);

  categoriesOptions$ = new BehaviorSubject<{ label: string; value: CategoryModel }[]>([]);

  formGroup!: FormGroup;

  constructor(
    private recordsFacadeService: RecordsFacadeService,
    private categoriesFacadeService: CategoriesFacadeService
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup<RecordFormGroup>({
      name: new FormControl(this.record.name, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      comment: new FormControl(this.record.comment, {
        nonNullable: true,
      }),
      category: new FormControl(this.record.category ?? null, {
        nonNullable: true,
      }),
    });

    this.loadParentCategories();
  }

  loadParentCategories(): void {
    this.isLoading$.next(true);

    this.categoriesFacadeService
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

  compareWithFn = (o1: CategoryModel, o2: CategoryModel): boolean => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  getUpdatedModel(): RecordModel {
    const { name, comment, category } = this.formGroup.value;

    const record = instanceToInstance(this.record, { ignoreDecorators: true })!;
    record.name = name;
    record.comment = comment;
    record.category = category;

    return record;
  }
}
