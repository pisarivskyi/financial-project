import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { instanceToInstance } from 'class-transformer';
import { BehaviorSubject } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { ProviderModel } from '../../../../api/providers/models/provider.model';
import { CreateFormGroupFromData } from '../../../../shared/types/create-form-group-from-data.type';

export interface ProviderFormData {
  name: string;
}

export type ProviderFormGroup = CreateFormGroupFromData<ProviderFormData>;

@Component({
  selector: 'fpd-provider-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    NzModalModule,
    NzSpinModule,
  ],
  templateUrl: './provider-form.component.html',
  styleUrls: ['./provider-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderFormComponent implements OnInit {
  @Input()
  provider = new ProviderModel();

  formGroup!: FormGroup;

  isLoading$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.formGroup = new FormGroup<ProviderFormGroup>({
      name: new FormControl(this.provider.name, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  getUpdatedModel(): ProviderModel {
    const { name } = this.formGroup.value;

    const provider = instanceToInstance(this.provider, { ignoreDecorators: true })!;
    provider.name = name;

    return provider;
  }
}
