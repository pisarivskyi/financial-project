import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { ProviderModel } from '../../../../../../api/providers/models/provider.model';

@Component({
  selector: 'fpd-select-provider-step',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzModalModule, NzSelectModule, FormsModule],
  templateUrl: './select-provider-step.component.html',
  styleUrls: ['./select-provider-step.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectProviderStepComponent {
  @Input()
  providers: ProviderModel[] = [];

  @Output()
  selectProvider = new EventEmitter<ProviderModel>();

  @Output()
  selectProviderAccountsStep = new EventEmitter<void>();

  @Output()
  addProviderStep = new EventEmitter<void>();

  selectedProvider: ProviderModel | null = null;

  private modalRef = inject(NzModalRef);

  onProviderChange(event: ProviderModel): void {
    this.selectProvider.next(event);
  }

  onAddProviderStep(): void {
    this.addProviderStep.emit();
  }

  onNext(): void {
    this.selectProviderAccountsStep.next();
  }

  onClose(): void {
    this.modalRef.close();
  }
}
