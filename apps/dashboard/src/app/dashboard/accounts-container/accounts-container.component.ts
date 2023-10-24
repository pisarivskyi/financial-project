import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';

import { CurrencyEnum } from '@financial-project/common';

import { AccountModel } from '../../api/accounts/models/account.model';
import { PageHeaderActionInterface } from '../../shared/components/page-header/interfaces/page-header-action.interface';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ISSUER_TO_LOGO } from '../../shared/constants/issuer-to-logo.const';
import { AmountFormatPipe } from '../../shared/pipes/amount-format/amount-format.pipe';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format/currency-format.pipe';
import { GetCreditCardBalancePipe } from '../../shared/pipes/get-credit-card-balance/get-credit-card-balance.pipe';
import { AddAccountModalComponent } from './components/add-account-modal/add-account-modal.component';
import { EditAccountModalComponent } from './components/edit-account-modal/edit-account-modal.component';
import { RunSynchronizationModalComponent } from './components/run-synchronization-modal/run-synchronization-modal.component';
import { AccountsFacadeService } from './services/accounts-facade.service';

@UntilDestroy()
@Component({
  selector: 'fpd-accounts-container',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzPopconfirmModule,
    NzTableModule,
    NzModalModule,
    NzMessageModule,
    AmountFormatPipe,
    CurrencyFormatPipe,
    GetCreditCardBalancePipe,
    PageHeaderComponent,
  ],
  templateUrl: './accounts-container.component.html',
  styleUrls: ['./accounts-container.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsContainerComponent implements OnInit {
  accounts$ = this.accountsFacadeService.accounts$;

  isLoading$ = this.accountsFacadeService.isLoading$;

  pagination$ = this.accountsFacadeService.pagination$;

  CurrencyEnum = CurrencyEnum;

  actions: PageHeaderActionInterface[] = [
    {
      label: 'Add account',
      type: 'primary',
      action: () => {
        this.onAddAccount();
      },
    },
  ];

  accountSynchronizationStatuses: Record<string, boolean> = {};

  readonly ISSUER_TO_LOGO = ISSUER_TO_LOGO;

  constructor(
    private accountsFacadeService: AccountsFacadeService,
    private modalService: NzModalService,
    private messageService: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe(({ page, size }) => {
      if (!page) {
        this.changeRouteQueryParams({ page: 1, size: 20 }, true);
      } else {
        page = Number(page ?? 1);
        size = Number(size ?? 20);

        this.accountsFacadeService.updatePagination(page, size);

        this.accountsFacadeService.loadAccounts();
      }
    });
  }

  onAddAccount(): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Add account',
      nzContent: AddAccountModalComponent,
      nzCentered: true,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.accountsFacadeService.loadAccounts();

        this.messageService.success('Account was created');
      }
    });
  }

  onSyncAccount(account: AccountModel): void {
    this.accountSynchronizationStatuses[account.id] = true;

    const modalRef = this.modalService.create({
      nzTitle: `Run synchronization for ${account.maskedPan}`,
      nzContent: RunSynchronizationModalComponent,
      nzCentered: true,
      nzData: account,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.accountsFacadeService.loadAccounts();

        this.messageService.success('Account was synchronized');
      }

      this.accountSynchronizationStatuses[account.id] = false;
      this.cdr.markForCheck();
    });
  }

  onEditAccount(account: AccountModel): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Edit account',
      nzContent: EditAccountModalComponent,
      nzCentered: true,
      nzData: account,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.accountsFacadeService.loadAccounts();

        this.messageService.success('Account item was updated');
      }
    });
  }

  onDeleteAccount(account: AccountModel): void {
    this.accountsFacadeService.deleteAccount$(account.id).subscribe(() => {
      this.accountsFacadeService.loadAccounts();

      this.messageService.success('Account item was deleted');
    });
  }

  onPageIndexChanged(pageIndex: number): void {
    this.activatedRoute.queryParams.pipe(take(1)).subscribe((queryParams) => {
      this.changeRouteQueryParams({
        ...queryParams,
        page: pageIndex,
      });
    });
  }

  private changeRouteQueryParams(queryParams: Params, replaceUrl = false): void {
    this.router.navigate(['./'], {
      queryParams,
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
      replaceUrl,
    });
  }
}
