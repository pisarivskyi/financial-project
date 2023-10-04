import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { BehaviorSubject, finalize } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { AccountModel } from '../../../../../../api/accounts/models/account.model';
import { ProviderAccountDataModel } from '../../../../../../api/providers/models/provider-account-data.model';
import { ProviderModel } from '../../../../../../api/providers/models/provider.model';
import { AmountFormatPipe } from '../../../../../../shared/pipes/amount-format/amount-format.pipe';
import { CurrencyFormatPipe } from '../../../../../../shared/pipes/currency-format/currency-format.pipe';
import { AccountsFacadeService } from '../../../../services/accounts-facade.service';

@Component({
  selector: 'fpd-save-accounts-step',
  standalone: true,
  imports: [CommonModule, NzSpinModule, NzButtonModule, NzModalModule, AmountFormatPipe, CurrencyFormatPipe],
  templateUrl: './save-accounts-step.component.html',
  styleUrls: ['./save-accounts-step.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveAccountsStepComponent implements OnInit {
  @Input({ required: true })
  selectProvider!: ProviderModel;

  @Input({ required: true })
  selectedProviderAccounts: ProviderAccountDataModel[] = [];

  @Output()
  savedAccounts = new EventEmitter<AccountModel[]>();

  @Output()
  synchronizationStep = new EventEmitter<void>();

  isLoading$ = new BehaviorSubject<boolean>(true);

  savedAccounts$ = new BehaviorSubject<AccountModel[]>([]);

  private accountsFacadeService = inject(AccountsFacadeService);
  private modalRef = inject(NzModalRef);

  ngOnInit(): void {
    this.accountsFacadeService
      .saveProviderAccounts$(this.selectProvider.id, this.selectedProviderAccounts)
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe((savedAccounts) => {
        this.savedAccounts.emit(savedAccounts);
        this.savedAccounts$.next(savedAccounts);
      });
  }

  onNext(): void {
    this.synchronizationStep.next();
  }

  onClose(): void {
    this.modalRef.destroy(true);
  }
}
