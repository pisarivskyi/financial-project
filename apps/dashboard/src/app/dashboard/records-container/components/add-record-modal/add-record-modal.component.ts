import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { BehaviorSubject, of, switchMap, take } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { AuthenticationService } from '../../../../core/authentication/services/authentication.service';
import { updateValueAndValidity } from '../../../../shared/utils/form-utils';
import { RecordsFacadeService } from '../../services/records-facade.service';
import { RecordFormComponent } from '../record-form/record-form.component';

@Component({
  selector: 'fpd-add-record-modal',
  standalone: true,
  imports: [CommonModule, RecordFormComponent, NzButtonModule, NzModalModule, NzSpinModule],
  templateUrl: './add-record-modal.component.html',
  styleUrls: ['./add-record-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddRecordModalComponent {
  @ViewChild('form', { read: RecordFormComponent, static: true })
  recordFormComponent!: RecordFormComponent;

  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private modalRef: NzModalRef,
    private authService: AuthenticationService,
    private recordsFacadeService: RecordsFacadeService
  ) {}

  onSubmit(): void {
    if (this.recordFormComponent.formGroup.valid) {
      this.isLoading$.next(true);

      this.authService
        .getCurrentUser$()
        .pipe(
          take(1),
          switchMap((currentUser) => {
            if (currentUser) {
              return this.recordsFacadeService.saveRecord$({
                ...this.recordFormComponent.getModel().toInsertData(),
                created_by: currentUser.id,
              });
            }

            return of(null);
          })
        )
        .subscribe(() => {
          this.isLoading$.next(false);

          this.modalRef.destroy(true);
        });
    } else {
      updateValueAndValidity(this.recordFormComponent.formGroup.controls);
    }
  }

  onDestroyModal(): void {
    this.modalRef.destroy();
  }
}
