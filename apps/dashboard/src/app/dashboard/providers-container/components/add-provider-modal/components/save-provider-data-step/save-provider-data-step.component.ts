import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, finalize } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { ProviderTypeEnum } from '@financial-project/common';

import { ProviderModel } from '../../../../../../api/providers/models/provider.model';
import { CreateFormGroupFromData } from '../../../../../../shared/types/create-form-group-from-data.type';
import { ProvidersFacadeService } from '../../../../services/providers-facade.service';

@Component({
  selector: 'fpd-save-provider-data-step',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSpinModule,
  ],
  templateUrl: './save-provider-data-step.component.html',
  styleUrls: ['./save-provider-data-step.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveProviderDataStepComponent {
  @Output()
  selectProvider = new EventEmitter<ProviderModel>();

  isLoading$ = new BehaviorSubject<boolean>(false);

  private modalRef = inject(NzModalRef);

  private providersFacadeService = inject(ProvidersFacadeService);

  form = new FormGroup<CreateFormGroupFromData<{ name: string; token: string }>>({
    name: new FormControl(ProviderTypeEnum.Monobank, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    token: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  onNext(): void {
    const { name, token } = this.form.value;

    if (token) {
      const provider = new ProviderModel();
      provider.name = name ?? ProviderTypeEnum.Monobank;
      provider.providerType = ProviderTypeEnum.Monobank;
      provider.data = {
        token,
      };

      this.isLoading$.next(true);

      this.providersFacadeService
        .saveProvider$(provider)
        .pipe(finalize(() => this.isLoading$.next(false)))
        .subscribe((provider) => {
          this.selectProvider.emit(provider);

          this.modalRef.close(true);
        });
    }
  }

  onClose(): void {
    this.modalRef.close();
  }
}
