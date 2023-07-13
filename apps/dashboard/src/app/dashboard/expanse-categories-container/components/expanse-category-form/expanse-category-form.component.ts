import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { ExpanseCategory } from '../../../../api/expanse-categories/models/expanse-category.model';
import { AuthenticationService } from '../../../../core/authentication/services/authentication.service';
import { CreateFormGroupFromData } from '../../../../shared/types/create-form-group-from-data.type';

export interface ExpanseCategoryFormData {
  name: string;
}

export type ExpanseFormGroup = CreateFormGroupFromData<ExpanseCategoryFormData>;

@Component({
  selector: 'fpd-expanse-category-form',
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
  templateUrl: './expanse-category-form.component.html',
  styleUrls: ['./expanse-category-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpanseCategoryFormComponent implements OnInit {
  @Input()
  expanseCategory: ExpanseCategory | null = null;

  formGroup!: FormGroup;


  constructor(
    private authService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup<ExpanseFormGroup>({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    if (this.expanseCategory) {
      this.formGroup.setValue({
        name: this.expanseCategory.name,
      });
    }
  }
}
