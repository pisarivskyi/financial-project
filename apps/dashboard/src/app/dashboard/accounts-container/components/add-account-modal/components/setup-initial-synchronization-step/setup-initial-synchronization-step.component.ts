import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateTime } from 'luxon';
import { BehaviorSubject, finalize } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { AccountModel } from '../../../../../../api/accounts/models/account.model';
import { CreateFormGroupFromData } from '../../../../../../shared/types/create-form-group-from-data.type';
import { AccountsFacadeService } from '../../../../services/accounts-facade.service';

export interface SynchronizationFormData {
  accounts: AccountModel[];
  range: Date[];
}

export type SynchronizationFormGroup = CreateFormGroupFromData<SynchronizationFormData>;

@Component({
  selector: 'fpd-setup-initial-synchronization-step',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzSpinModule,
    NzModalModule,
    NzButtonModule,
    NzSelectModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
  ],
  templateUrl: './setup-initial-synchronization-step.component.html',
  styleUrls: ['./setup-initial-synchronization-step.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupInitialSynchronizationStepComponent implements OnInit {
  @Input({ required: true })
  accounts: AccountModel[] = [];

  isLoading$ = new BehaviorSubject<boolean>(false);

  options: { label: string; value: AccountModel }[] = [];

  form!: FormGroup<SynchronizationFormGroup>;

  private accountsFacadeService = inject(AccountsFacadeService);
  private modalRef = inject(NzModalRef);

  ngOnInit(): void {
    this.options = this.accounts.map((account) => ({ label: account.maskedPan, value: account }));

    this.form = new FormGroup<SynchronizationFormGroup>({
      accounts: new FormControl([], {
        nonNullable: true,
        validators: [Validators.required],
      }),
      range: new FormControl([DateTime.now().minus({ month: 1 }).toJSDate(), DateTime.now().toJSDate()], {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  onNext(): void {
    this.isLoading$.next(true);

    const { range, accounts } = this.form.getRawValue();

    const fromDate = DateTime.fromJSDate(range[0]).setZone('utc').startOf('month').startOf('day').toJSDate();
    const toDate = DateTime.fromJSDate(range[1]).setZone('utc').endOf('month').endOf('day').toJSDate();

    this.accountsFacadeService
      .createSynchronizationJobsForAccountsAndWait$(accounts, fromDate, toDate)
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe(() => this.modalRef.destroy(true));
  }

  onClose(): void {
    this.modalRef.destroy(true);
  }
}
