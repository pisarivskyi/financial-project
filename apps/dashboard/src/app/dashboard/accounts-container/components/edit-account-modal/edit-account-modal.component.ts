import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { AuthenticationService } from '../../../../core/authentication/services/authentication.service';
import { updateValueAndValidity } from '../../../../shared/utils/form-utils';
import { AccountsFacadeService } from '../../services/accounts-facade.service';
import { AccountFormComponent } from '../account-form/account-form.component';
import { Account } from '../../../../api/accounts/models/account.model';

@Component({
  selector: 'fpd-edit-account-modal',
  standalone: true,
  imports: [CommonModule, AccountFormComponent, NzButtonModule, NzModalModule, NzSpinModule],
  templateUrl: './edit-account-modal.component.html',
  styleUrls: ['./edit-account-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAccountModalComponent {
  @ViewChild('form', { read: AccountFormComponent, static: true })
  accountFormComponent!: AccountFormComponent;

  isLoading$ = new BehaviorSubject<boolean>(false);

  account: Account;

  constructor(
    private modalRef: NzModalRef,
    private authService: AuthenticationService,
    private accountsFacadeService: AccountsFacadeService
  ) {
    this.account = this.modalRef.getConfig().nzData;
  }

  onSubmit(): void {
    if (this.accountFormComponent.formGroup.valid) {
      this.isLoading$.next(true);

      this.accountsFacadeService
        .updateAccount$(this.account.id, this.accountFormComponent.getUpdatedModel().toUpdateData())
        .subscribe(() => {
          this.isLoading$.next(false);

          this.modalRef.destroy(true);
        });
    } else {
      updateValueAndValidity(this.accountFormComponent.formGroup.controls);
    }
  }

  onDestroyModal(): void {
    this.modalRef.destroy();
  }
}
