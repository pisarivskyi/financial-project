import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { ExpanseModel } from '../../../../api/expanses/models/expanse.model';
import { AuthenticationService } from '../../../../core/authentication/services/authentication.service';
import { updateValueAndValidity } from '../../../../shared/utils/form-utils';
import { ExpansesFacadeService } from '../../services/expanses-facade.service';
import { ExpanseFormComponent } from '../expanse-form/expanse-form.component';

@Component({
  selector: 'fpd-edit-expanse-modal',
  standalone: true,
  imports: [CommonModule, ExpanseFormComponent, NzButtonModule, NzModalModule, NzSpinModule],
  templateUrl: './edit-expanse-modal.component.html',
  styleUrls: ['./edit-expanse-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditExpanseModalComponent {
  @ViewChild('form', { read: ExpanseFormComponent, static: true })
  expanseFormComponent!: ExpanseFormComponent;

  isLoading$ = new BehaviorSubject<boolean>(false);

  expanse: ExpanseModel;

  constructor(
    private modalRef: NzModalRef,
    private authService: AuthenticationService,
    private expanseService: ExpansesFacadeService
  ) {
    this.expanse = this.modalRef.getConfig().nzData;
  }

  onSubmit(): void {
    if (this.expanseFormComponent.formGroup.valid) {
      this.isLoading$.next(true);

      this.expanseService
        .updateExpanse(this.expanse.id, ExpanseModel.toUpdateData(this.expanseFormComponent.formGroup.value))
        .subscribe((d) => {
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
