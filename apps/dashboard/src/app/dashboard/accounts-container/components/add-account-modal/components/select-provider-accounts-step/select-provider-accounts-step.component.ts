import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, finalize } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { ProviderAccountDataModel } from '../../../../../../api/providers/models/provider-account-data.model';
import { ProviderAccountsModel } from '../../../../../../api/providers/models/provider-accounts.model';
import { ProviderModel } from '../../../../../../api/providers/models/provider.model';
import { AccountsFacadeService } from '../../../../services/accounts-facade.service';

@Component({
  selector: 'fpd-select-provider-accounts-step',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzModalModule, NzSpinModule, NzSelectModule, FormsModule],
  templateUrl: './select-provider-accounts-step.component.html',
  styleUrls: ['./select-provider-accounts-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectProviderAccountsStepComponent implements OnInit {
  @Input({ required: true })
  selectProvider!: ProviderModel;

  @Output()
  selectAccounts = new EventEmitter<ProviderAccountDataModel[]>();

  @Output()
  saveAccountsStep = new EventEmitter<void>();

  isLoading$ = new BehaviorSubject<boolean>(true);

  selectedAccounts: ProviderAccountDataModel[] = [];

  providerAccountsData$!: Observable<ProviderAccountsModel>;

  private modalRef = inject(NzModalRef);

  private accountsFacadeService = inject(AccountsFacadeService);

  ngOnInit(): void {
    this.providerAccountsData$ = this.accountsFacadeService
      .getProviderAccounts$(this.selectProvider.id)
      .pipe(finalize(() => this.isLoading$.next(false)));
  }

  onAccountsChange(accounts: ProviderAccountDataModel[]): void {
    this.selectAccounts.emit(accounts);
  }

  onNext(): void {
    this.saveAccountsStep.next();
  }

  onClose(): void {
    this.modalRef.close();
  }
}
