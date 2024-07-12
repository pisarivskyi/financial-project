import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';

import { ProviderModel } from '../../api/providers/models/provider.model';
import { PageHeaderActionInterface } from '../../shared/components/page-header/interfaces/page-header-action.interface';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { AddProviderModalComponent } from './components/add-provider-modal/add-provider-modal.component';
import { EditProviderModalComponent } from './components/edit-provider-modal/edit-provider-modal.component';
import { ProvidersFacadeService } from './services/providers-facade.service';

@UntilDestroy()
@Component({
  selector: 'fpd-providers-container',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzPopconfirmModule, NzTableModule, PageHeaderComponent, NgOptimizedImage],
  templateUrl: './providers-container.component.html',
  styleUrls: ['./providers-container.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProvidersContainerComponent implements OnInit {
  providers$ = this.providersFacadeService.providers$;

  isLoading$ = this.providersFacadeService.isLoading$;

  pagination$ = this.providersFacadeService.pagination$;

  actions: PageHeaderActionInterface[] = [
    {
      label: 'Add bank',
      type: 'primary',
      action: () => {
        this.onAddProvider();
      },
    },
  ];

  constructor(
    private providersFacadeService: ProvidersFacadeService,
    private modalService: NzModalService,
    private messageService: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe(({ page, size }) => {
      if (!page) {
        this.changeRouteQueryParams({ page: 1 }, true);
      } else {
        page = Number(page ?? 1);
        size = Number(size ?? 10);

        this.providersFacadeService.updatePagination(page, size);

        this.providersFacadeService.loadProviders();
      }
    });
  }

  onAddProvider(): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Add new bank',
      nzContent: AddProviderModalComponent,
      nzCentered: true,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.providersFacadeService.loadProviders();

        this.messageService.success('Provider was created');
      }
    });
  }

  onEditProvider(provider: ProviderModel): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Edit bank',
      nzContent: EditProviderModalComponent,
      nzCentered: true,
      nzData: provider,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.providersFacadeService.loadProviders();

        this.messageService.success('Bank was updated');
      }
    });
  }

  onDeleteProvider(provider: ProviderModel): void {
    this.providersFacadeService.deleteProvider$(provider.id).subscribe(() => {
      this.providersFacadeService.loadProviders();

      this.messageService.success('Provider was deleted');
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
