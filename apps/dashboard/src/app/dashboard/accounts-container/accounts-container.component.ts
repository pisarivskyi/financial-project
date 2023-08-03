import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';

import { Account } from '../../api/accounts/models/account.model';
import { AddAccountModalComponent } from './components/add-account-modal/add-account-modal.component';
import { EditAccountModalComponent } from './components/edit-account-modal/edit-account-modal.component';
import { AccountsFacadeService } from './services/accounts-facade.service';

@UntilDestroy()
@Component({
  selector: 'fpd-accounts-container',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzPopconfirmModule, NzTableModule, NzModalModule, NzMessageModule],
  templateUrl: './accounts-container.component.html',
  styleUrls: ['./accounts-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsContainerComponent implements OnInit {
  accounts$ = this.accountsFacadeService.accounts$;

  isLoading$ = this.accountsFacadeService.isLoading$;

  pagination$ = this.accountsFacadeService.pagination$;

  constructor(
    private accountsFacadeService: AccountsFacadeService,
    private modalService: NzModalService,
    private messageService: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe(({ page, size }) => {
      if (!page) {
        this.changeRouteQueryParams({ page: 1, size: 20 }, true);
      } else {
        page = Number(page ?? 1);
        size = Number(size ?? 20);

        this.accountsFacadeService.updatePagination({
          pageIndex: page,
          pageSize: size,
        });

        this.accountsFacadeService.getAccounts();
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
        this.accountsFacadeService.getAccounts();

        this.messageService.success('Account was created');
      }
    });
  }

  onEditAccount(account: Account): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Edit account',
      nzContent: EditAccountModalComponent,
      nzCentered: true,
      nzData: account,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.accountsFacadeService.getAccounts();

        this.messageService.success('Account item was updated');
      }
    });
  }

  onDeleteAccount(account: Account): void {
    this.accountsFacadeService.deleteAccount$(account.id).subscribe(() => {
      this.accountsFacadeService.getAccounts();

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
