import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { ProviderTypeEnum } from '@financial-project/common';

import { PROVIDER_OPTIONS } from '../../../../../../shared/constants/provider-options.const';

@Component({
  selector: 'fpd-add-provider-step',
  standalone: true,
  imports: [CommonModule, NzSelectModule, FormsModule, NzButtonModule, NzModalModule],
  templateUrl: './add-provider-step.component.html',
  styleUrls: ['./add-provider-step.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProviderStepComponent {
  @Output()
  selectedProviderTypeToAdd = new EventEmitter<ProviderTypeEnum>();

  @Output()
  saveProviderDataStep = new EventEmitter<void>();

  readonly PROVIDER_OPTIONS = PROVIDER_OPTIONS;

  selectedProviderType: ProviderTypeEnum | null = null;

  private modalRef = inject(NzModalRef);

  onProviderChange(providerType: ProviderTypeEnum): void {
    this.selectedProviderType = providerType;
    this.selectedProviderTypeToAdd.emit(this.selectedProviderType);
  }

  onNext(): void {
    if (this.selectedProviderType) {
      this.saveProviderDataStep.emit();
    }
  }

  onClose(): void {
    this.modalRef.close();
  }
}
