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
import { CreateFormGroupFromData } from '../../../../shared/types/create-form-group-from-data.type';
import { CategoriesFacadeService } from '../../services/categories-facade.service';

export interface CategoryFormData {
  name: string;
  color: string;
  icon: string;
  parentCategory: CategoryModel | null | undefined;
}

export type CategoryFormGroup = CreateFormGroupFromData<CategoryFormData>;

@UntilDestroy()
@Component({
  selector: 'fpd-category-form',
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
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFormComponent implements OnInit {
  @Input()
  category = new CategoryModel();

  formGroup!: FormGroup;

  isLoading$ = new BehaviorSubject<boolean>(false);

  categoriesOptions$ = new BehaviorSubject<{ label: string; value: CategoryModel }[]>([]);

  constructor(private categoriesFacadeService: CategoriesFacadeService) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup<CategoryFormGroup>({
      name: new FormControl(this.category.name, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      color: new FormControl(this.category.color, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      icon: new FormControl(this.category.icon, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      parentCategory: new FormControl(this.category.parentCategory, {
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

  getUpdatedModel(): CategoryModel {
    const { name, color, icon, parentCategory } = this.formGroup.value;

    const category = instanceToInstance(this.category, { ignoreDecorators: true })!;
    category.name = name;
    category.color = color;
    category.icon = icon;
    category.parentCategory = parentCategory;

    return category;
  }

  compareWithFn = (o1: CategoryModel, o2: CategoryModel): boolean => (o1 && o2 ? o1.id === o2.id : o1 === o2);
}
