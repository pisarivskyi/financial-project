import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { BehaviorSubject, of, switchMap, take } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { AuthenticationService } from '../../../../core/authentication/services/authentication.service';
import { updateValueAndValidity } from '../../../../shared/utils/form-utils';
import { AccountsFacadeService } from '../../services/accounts-facade.service';
import { AccountFormComponent } from '../account-form/account-form.component';

@Component({
  selector: 'fpd-add-account-modal',
  standalone: true,
  imports: [CommonModule, AccountFormComponent, NzButtonModule, NzModalModule, NzSpinModule],
  templateUrl: './add-account-modal.component.html',
  styleUrls: ['./add-account-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAccountModalComponent {
  @ViewChild('form', { read: AccountFormComponent, static: true })
  accountFormComponent!: AccountFormComponent;

  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private modalRef: NzModalRef,
    private authService: AuthenticationService,
    private accountsFacadeService: AccountsFacadeService
  ) {}

  onSubmit(): void {
    if (this.accountFormComponent.formGroup.valid) {
      this.isLoading$.next(true);

      this.authService
        .getCurrentUser$()
        .pipe(
          take(1),
          switchMap((currentUser) => {
            if (currentUser) {
              return this.accountsFacadeService.saveAccount$({
                ...this.accountFormComponent.getModel().toInsertData(),
                created_by: currentUser.id,
              });
            }

            return of(null);
          }),
        )
        .subscribe((r) => {
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
