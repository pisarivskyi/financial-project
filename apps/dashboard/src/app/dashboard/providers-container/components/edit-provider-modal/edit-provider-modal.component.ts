import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { ProviderModel } from '../../../../api/providers/models/provider.model';
import { updateValueAndValidity } from '../../../../shared/utils/form-utils';
import { ProvidersFacadeService } from '../../services/providers-facade.service';
import { ProviderFormComponent } from '../provider-form/provider-form.component';

@Component({
  selector: 'fpd-edit-provider-modal',
  standalone: true,
  imports: [CommonModule, ProviderFormComponent, NzButtonModule, NzModalModule, NzSpinModule],
  templateUrl: './edit-provider-modal.component.html',
  styleUrls: ['./edit-provider-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProviderModalComponent {
  @ViewChild('form', { read: ProviderFormComponent, static: true })
  providerFormComponent!: ProviderFormComponent;

  isLoading$ = new BehaviorSubject<boolean>(false);

  provider: ProviderModel;

  constructor(private modalRef: NzModalRef, private providersFacadeService: ProvidersFacadeService) {
    this.provider = this.modalRef.getConfig().nzData;
  }

  onSubmit(): void {
    if (this.providerFormComponent.formGroup.valid) {
      this.isLoading$.next(true);

      this.providersFacadeService.updateProvider$(this.providerFormComponent.getUpdatedModel()).subscribe(() => {
        this.isLoading$.next(false);

        this.modalRef.destroy(true);
      });
    } else {
      updateValueAndValidity(this.providerFormComponent.formGroup.controls);
    }
  }

  onDestroyModal(): void {
    this.modalRef.destroy();
  }
}
