import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { instanceToInstance } from 'class-transformer';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { CurrencyEnum } from '@financial-project/common';

import { SettingsModel } from '../../../../api/settings/models/settings.model';
import { CURRENCY_OPTIONS } from '../../../../shared/constants/currency-options.const';
import { CreateFormGroupFromData } from '../../../../shared/types/create-form-group-from-data.type';

export interface SettingsFormData {
  billingPeriodStartDayNumber: number;
  defaultCurrencyCode: CurrencyEnum;
}

export type SettingsFormGroup = CreateFormGroupFromData<SettingsFormData>;

@Component({
  selector: 'fpd-settings-form',
  standalone: true,
  imports: [NzSelectModule, FormsModule, NzFormModule, ReactiveFormsModule, NzInputNumberModule],
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsFormComponent implements OnInit {
  @Input()
  settings = new SettingsModel();

  formGroup!: FormGroup;

  readonly CURRENCY_OPTIONS = CURRENCY_OPTIONS;

  ngOnInit(): void {
    this.formGroup = new FormGroup<SettingsFormGroup>({
      defaultCurrencyCode: new FormControl(this.settings.defaultCurrencyCode, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      billingPeriodStartDayNumber: new FormControl(this.settings.billingPeriodStartDayNumber, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  getUpdatedModel(): SettingsModel {
    const settings = instanceToInstance(this.settings, { ignoreDecorators: true });
    settings.defaultCurrencyCode = this.formGroup.value.defaultCurrencyCode;
    settings.billingPeriodStartDayNumber = this.formGroup.value.billingPeriodStartDayNumber;

    return settings;
  }
}
