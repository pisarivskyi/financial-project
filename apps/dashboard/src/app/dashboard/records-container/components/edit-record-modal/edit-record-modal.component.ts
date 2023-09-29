import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { RecordModel } from '../../../../api/records/models/record.model';
import { updateValueAndValidity } from '../../../../shared/utils/form-utils';
import { RecordsFacadeService } from '../../services/records-facade.service';
import { RecordFormComponent } from '../record-form/record-form.component';

@Component({
  selector: 'fpd-edit-record-modal',
  standalone: true,
  imports: [CommonModule, RecordFormComponent, NzButtonModule, NzModalModule, NzSpinModule],
  templateUrl: './edit-record-modal.component.html',
  styleUrls: ['./edit-record-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditRecordModalComponent {
  @ViewChild('form', { read: RecordFormComponent, static: true })
  recordFormComponent!: RecordFormComponent;

  isLoading$ = new BehaviorSubject<boolean>(false);

  record: RecordModel;

  constructor(private modalRef: NzModalRef, private recordsFacadeService: RecordsFacadeService) {
    this.record = this.modalRef.getConfig().nzData;
  }

  onSubmit(): void {
    if (this.recordFormComponent.formGroup.valid) {
      this.isLoading$.next(true);

      this.recordsFacadeService.updateRecord$(this.recordFormComponent.getUpdatedModel()).subscribe((d) => {
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
