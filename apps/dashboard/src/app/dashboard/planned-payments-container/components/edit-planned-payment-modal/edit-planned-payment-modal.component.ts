import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { PlannedPaymentModel } from '../../../../api/planned-payments/models/planned-payment.model';
import { updateValueAndValidity } from '../../../../shared/utils/form-utils';
import { PlannedPaymentsFacadeService } from '../../services/planned-payments-facade.service';
import { PlannedPaymentFormComponent } from '../planned-payment-form/planned-payment-form.component';

@Component({
  selector: 'fpd-edit-planned-payment-modal',
  standalone: true,
  imports: [CommonModule, PlannedPaymentFormComponent, NzButtonModule, NzModalModule, NzSpinModule],
  templateUrl: './edit-planned-payment-modal.component.html',
  styleUrls: ['./edit-planned-payment-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPlannedPaymentModalComponent {
  @ViewChild('form', { read: PlannedPaymentFormComponent, static: true })
  plannedPaymentFormComponent!: PlannedPaymentFormComponent;

  isLoading$ = new BehaviorSubject<boolean>(false);

  plannedPayment: PlannedPaymentModel;

  constructor(
    private modalRef: NzModalRef,
    private plannedPaymentsFacadeService: PlannedPaymentsFacadeService,
  ) {
    this.plannedPayment = this.modalRef.getConfig().nzData;
  }

  onSubmit(): void {
    if (this.plannedPaymentFormComponent.formGroup.valid) {
      this.isLoading$.next(true);

      this.plannedPaymentsFacadeService
        .updatePlannedPayment$(this.plannedPaymentFormComponent.getUpdatedModel())
        .subscribe(() => {
          this.isLoading$.next(false);

          this.modalRef.destroy(true);
        });
    } else {
      updateValueAndValidity(this.plannedPaymentFormComponent.formGroup.controls);
    }
  }

  onDestroyModal(): void {
    this.modalRef.destroy();
  }
}
