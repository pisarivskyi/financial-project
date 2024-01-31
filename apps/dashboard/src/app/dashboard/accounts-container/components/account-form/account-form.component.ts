import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { instanceToInstance } from 'class-transformer';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { AccountModel } from '../../../../api/accounts/models/account.model';
import { CreateFormGroupFromData } from '../../../../shared/types/create-form-group-from-data.type';

export interface AccountFormData {
  name: string;
}

export type AccountFormGroup = CreateFormGroupFromData<AccountFormData>;

@Component({
  selector: 'fpd-account-form',
  standalone: true,
  imports: [
    NzSelectModule,
    FormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    NzInputNumberModule,
    NzModalModule,
  ],
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFormComponent implements OnInit {
  @Input()
  account = new AccountModel();

  formGroup!: FormGroup;

  ngOnInit(): void {
    this.formGroup = new FormGroup<AccountFormGroup>({
      name: new FormControl(this.account.name, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  getUpdatedModel(): AccountModel {
    const account = instanceToInstance(this.account, { ignoreDecorators: true })!;
    account.name = this.formGroup.value.name;

    return account;
  }
}
