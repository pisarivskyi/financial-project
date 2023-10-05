import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';

import { ProviderTypeEnum } from '@financial-project/common';

import { ProviderModel } from '../../../../api/providers/models/provider.model';
import { AddProviderStepComponent } from './components/add-provider-step/add-provider-step.component';
import { SaveProviderDataStepComponent } from './components/save-provider-data-step/save-provider-data-step.component';
import { AddProviderStepEnum } from './enums/add-provider-step.enum';

@Component({
  selector: 'fpd-add-provider-modal',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzModalModule, SaveProviderDataStepComponent, AddProviderStepComponent],
  templateUrl: './add-provider-modal.component.html',
  styleUrls: ['./add-provider-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProviderModalComponent {
  currentStep = AddProviderStepEnum.AddProvider;

  selectedProvider!: ProviderModel;
  selectedProviderType!: ProviderTypeEnum;

  readonly AddProviderStepEnum = AddProviderStepEnum;

  constructor(private modalRef: NzModalRef) {}

  onDestroyModal(): void {
    this.modalRef.destroy();
  }

  onSelectProvider(provider: ProviderModel): void {
    this.selectedProvider = provider;
  }

  onSelectedProviderTypeToAdd(providerType: ProviderTypeEnum): void {
    this.selectedProviderType = providerType;
  }

  onSaveProviderDataStep(): void {
    this.currentStep = AddProviderStepEnum.SaveProviderData;
  }
}
