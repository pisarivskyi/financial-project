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

import { AccountType } from '../../../../api/accounts/enums/account-type.enum';
import { ProviderEnum } from '../../../../api/accounts/enums/provider.enum';
import { Account } from '../../../../api/accounts/models/account.model';
import { ACCOUNT_TYPE_OPTIONS } from '../../../../shared/constants/account-type-options.const';
import { CURRENCY_OPTIONS } from '../../../../shared/constants/currency-options.const';
import { PROVIDER_OPTIONS } from '../../../../shared/constants/provider-options.const';
import { CurrencyEnum } from '../../../../shared/enums/currency.enum';
import { CreateFormGroupFromData } from '../../../../shared/types/create-form-group-from-data.type';

export interface AccountFormData {
  name: string;
  balance: number;
  type: AccountType | null;
  provider: ProviderEnum | null;
  currencyCode: CurrencyEnum | null;
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

  readonly ACCOUNT_TYPE_OPTIONS = ACCOUNT_TYPE_OPTIONS;

  readonly CURRENCY_OPTIONS = CURRENCY_OPTIONS;

  readonly PROVIDER_OPTIONS = PROVIDER_OPTIONS;

  ngOnInit(): void {
    this.formGroup = new FormGroup<AccountFormGroup>({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      balance: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      type: new FormControl(null, {
        validators: [Validators.required],
      }),
      provider: new FormControl(null, {
        validators: [Validators.required],
      }),
      currencyCode: new FormControl(null, {
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
    account.balance = this.formGroup.value.balance;
    account.type = this.formGroup.value.type;
    account.provider = this.formGroup.value.provider;
    account.currencyCode = this.formGroup.value.currencyCode;

    return account;
  }

  getUpdatedModel(): Account {
    const account = instanceToInstance(this.account, { ignoreDecorators: true })!;
    account.name = this.formGroup.value.name;

    return account;
  }
}
