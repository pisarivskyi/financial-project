import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, map, shareReplay, take } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { ProviderTypeEnum } from '@financial-project/common';

import { AccountModel } from '../../../../api/accounts/models/account.model';
import { ProviderAccountDataModel } from '../../../../api/providers/models/provider-account-data.model';
import { ProviderModel } from '../../../../api/providers/models/provider.model';
import { AccountsFacadeService } from '../../services/accounts-facade.service';
import { AddProviderStepComponent } from './components/add-provider-step/add-provider-step.component';
import { SaveAccountsStepComponent } from './components/save-accounts-step/save-accounts-step.component';
import { SaveProviderDataStepComponent } from './components/save-provider-data-step/save-provider-data-step.component';
import { SelectProviderAccountsStepComponent } from './components/select-provider-accounts-step/select-provider-accounts-step.component';
import { SelectProviderStepComponent } from './components/select-provider-step/select-provider-step.component';
import { SetupInitialSynchronizationStepComponent } from './components/setup-initial-synchronization-step/setup-initial-synchronization-step.component';
import { AddAccountStepEnum } from './enums/add-account-step.enum';

@Component({
  selector: 'fpd-add-account-modal',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzModalModule,
    SelectProviderStepComponent,
    SelectProviderAccountsStepComponent,
    SaveAccountsStepComponent,
    SetupInitialSynchronizationStepComponent,
    NzSpinModule,
    SaveProviderDataStepComponent,
    AddProviderStepComponent,
  ],
  templateUrl: './add-account-modal.component.html',
  styleUrls: ['./add-account-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAccountModalComponent implements OnInit {
  isLoading$ = new BehaviorSubject<boolean>(true);

  currentStep!: AddAccountStepEnum;

  selectedProvider!: ProviderModel;
  selectedProviderAccounts: ProviderAccountDataModel[] = [];
  selectedProviderType!: ProviderTypeEnum;
  savedAccounts: AccountModel[] = [];

  providers$ = this.accountsFacadeService.getProviders$().pipe(
    map((response) => response.data),
    shareReplay(1)
  );

  readonly AddAccountStepEnum = AddAccountStepEnum;

  constructor(private modalRef: NzModalRef, private accountsFacadeService: AccountsFacadeService) {}

  ngOnInit(): void {
    this.providers$.pipe(take(1)).subscribe((providers) => {
      this.isLoading$.next(false);

      if (providers.length) {
        this.currentStep = AddAccountStepEnum.SelectProvider;
      } else {
        this.currentStep = AddAccountStepEnum.AddProvider;
      }
    });
  }

  onDestroyModal(): void {
    this.modalRef.destroy();
  }

  onSelectProvider(provider: ProviderModel): void {
    this.selectedProvider = provider;
  }

  onSelectAccounts(accounts: ProviderAccountDataModel[]): void {
    this.selectedProviderAccounts = accounts;
  }

  onSavedAccounts(accounts: AccountModel[]): void {
    this.savedAccounts = accounts;
  }

  onSelectedProviderTypeToAdd(providerType: ProviderTypeEnum): void {
    this.selectedProviderType = providerType;
  }

  onSelectProviderAccountsStep(): void {
    this.currentStep = AddAccountStepEnum.SelectProviderAccounts;
  }

  onSaveAccountsStep(): void {
    this.currentStep = AddAccountStepEnum.SaveAccounts;
  }

  onSynchronizationStep(): void {
    this.currentStep = AddAccountStepEnum.Synchronization;
  }

  onSaveProviderDataStep(): void {
    this.currentStep = AddAccountStepEnum.SaveProviderData;
  }

  onAddProviderStep(): void {
    this.currentStep = AddAccountStepEnum.AddProvider;
  }
}
