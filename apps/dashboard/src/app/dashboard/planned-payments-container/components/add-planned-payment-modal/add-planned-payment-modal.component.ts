import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { updateValueAndValidity } from '../../../../shared/utils/form-utils';
import { PlannedPaymentsFacadeService } from '../../services/planned-payments-facade.service';
import { PlannedPaymentFormComponent } from '../planned-payment-form/planned-payment-form.component';

@Component({
  selector: 'fpd-add-planned-payment-modal',
  standalone: true,
  imports: [CommonModule, PlannedPaymentFormComponent, NzButtonModule, NzModalModule, NzSpinModule],
  templateUrl: './add-planned-payment-modal.component.html',
  styleUrls: ['./add-planned-payment-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPlannedPaymentModalComponent {
  @ViewChild('form', { read: PlannedPaymentFormComponent, static: true })
  plannedPaymentFormComponent!: PlannedPaymentFormComponent;

  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private modalRef: NzModalRef,
    private plannedPaymentsFacadeService: PlannedPaymentsFacadeService,
  ) {}

  onSubmit(): void {
    if (this.plannedPaymentFormComponent.formGroup.valid) {
      this.isLoading$.next(true);

      this.plannedPaymentsFacadeService
        .savePlannedPayment$(this.plannedPaymentFormComponent.getUpdatedModel())
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
