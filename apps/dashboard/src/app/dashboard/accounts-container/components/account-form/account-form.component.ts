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

import { CreateFormGroupFromData } from '../../../../shared/types/create-form-group-from-data.type';
import { Account } from '../../../../api/accounts/models/account.model';

export interface AccountFormData {
  name: string;
}

export type AccountFormGroup = CreateFormGroupFromData<AccountFormData>;

@Component({
  selector: 'fpd-account-form',
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
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFormComponent implements OnInit {
  @Input()
  account: Account | null = null;

  formGroup!: FormGroup;

  ngOnInit(): void {
    this.formGroup = new FormGroup<AccountFormGroup>({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    if (this.account) {
      this.formGroup.setValue({
        name: this.account.name,
      });
    }
  }

  getModel(): Account {
    const account = new Account();
    account.name = this.formGroup.value.name;

    return account;
  }

  getUpdatedModel(): Account {
    const account = instanceToInstance(this.account, { ignoreDecorators: true })!;
    account.name = this.formGroup.value.name;

    return account;
  }
}
