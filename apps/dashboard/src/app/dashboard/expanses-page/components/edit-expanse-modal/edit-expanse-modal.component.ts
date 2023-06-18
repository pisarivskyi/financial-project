import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { ExpanseFormComponent } from '../expanse-form/expanse-form.component';
import { AuthenticationService } from '../../../../core/authentication/services/authentication.service';
import { ExpansesFacadeService } from '../../services/expanses-facade.service';
import { ExpanseModel } from '../../../../api/expanses/models/expanse.model';
import { updateValueAndValidity } from '../../../../shared/utils/form-utils';

@Component({
  selector: 'fpd-edit-expanse-modal',
  standalone: true,
  imports: [
    CommonModule,
    ExpanseFormComponent,
    NzButtonModule,
    NzModalModule,
    NzSpinModule,
  ],
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

      this.expanseService.updateExpanse(
        this.expanse.id,
        ExpanseModel.toUpdateData(this.expanseFormComponent.formGroup.value)
      )
        .subscribe((d) => {
          console.log(d);
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
