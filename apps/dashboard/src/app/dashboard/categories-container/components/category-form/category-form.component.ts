import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { instanceToInstance } from 'class-transformer';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { Category } from '../../../../api/categories/models/category.model';
import { CreateFormGroupFromData } from '../../../../shared/types/create-form-group-from-data.type';

export interface CategoryFormData {
  name: string;
}

export type CategoryFormGroup = CreateFormGroupFromData<CategoryFormData>;

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
  ],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFormComponent implements OnInit {
  @Input()
  category: Category | null = null;

  formGroup!: FormGroup;

  ngOnInit(): void {
    this.formGroup = new FormGroup<CategoryFormGroup>({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    if (this.category) {
      this.formGroup.setValue({
        name: this.category.name,
      });
    }
  }

  getModel(): Category {
    const category = new Category();
    category.name = this.formGroup.value.name;

    return category;
  }

  getUpdatedModel(): Category {
    const category = instanceToInstance(this.category, { ignoreDecorators: true })!;
    category.name = this.formGroup.value.name;

    return category;
  }
}
