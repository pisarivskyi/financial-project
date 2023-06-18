import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, of, switchMap, take } from 'rxjs';

import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { ExpansesFacadeService } from '../../services/expanses-facade.service';
import { ExpanseModel } from '../../../../api/expanses/models/expanse.model';
import { AuthenticationService } from '../../../../core/authentication/services/authentication.service';
import { ExpanseFormComponent } from '../expanse-form/expanse-form.component';
import { updateValueAndValidity } from '../../../../shared/utils/form-utils';

@Component({
  selector: 'fpd-add-expanse-modal',
  standalone: true,
  imports: [
    CommonModule,
    ExpanseFormComponent,
    NzButtonModule,
    NzModalModule,
    NzSpinModule,
  ],
  templateUrl: './add-expanse-modal.component.html',
  styleUrls: ['./add-expanse-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddExpanseModalComponent {
  @ViewChild('form', { read: ExpanseFormComponent, static: true })
  expanseFormComponent!: ExpanseFormComponent;

  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private modalRef: NzModalRef,
    private authService: AuthenticationService,
    private expanseService: ExpansesFacadeService,
  ) {}

  onSubmit(): void {
    if (this.expanseFormComponent.formGroup.valid) {
      this.isLoading$.next(true);

      this.authService
        .getCurrentUser$()
        .pipe(
          take(1),
          switchMap((currentUser) => {
            if (currentUser) {
              return this.expanseService.saveExpanse(
                ExpanseModel.toInsertData({
                  createdBy: currentUser.id,
                  ...this.expanseFormComponent.formGroup.value,
                })
              );
            }

            return of(null);
          })
        )
        .subscribe(() => {
          this.isLoading$.next(false);

          this.modalRef.destroy(true);
        });
    } else {
      updateValueAndValidity(this.expanseFormComponent.formGroup.controls);
    }
  }

  onDestroyModal(): void {
    this.modalRef.destroy();
  }
}
