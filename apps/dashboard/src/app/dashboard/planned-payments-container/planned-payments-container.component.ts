import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';

import { PlannedPaymentModel } from '../../api/planned-payments/models/planned-payment.model';
import { PageHeaderActionInterface } from '../../shared/components/page-header/interfaces/page-header-action.interface';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PERIOD_TO_LABEL } from '../../shared/constants/period-to-label.const';
import { RECORD_TYPE_TO_LABEL } from '../../shared/constants/record-type-to-label.const';
import { AmountFormatPipe } from '../../shared/pipes/amount-format/amount-format.pipe';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format/currency-format.pipe';
import { AddPlannedPaymentModalComponent } from './components/add-planned-payment-modal/add-planned-payment-modal.component';
import { EditPlannedPaymentModalComponent } from './components/edit-planned-payment-modal/edit-planned-payment-modal.component';
import { PlannedPaymentsFacadeService } from './services/planned-payments-facade.service';

@UntilDestroy()
@Component({
  selector: 'fpd-planned-payments-container',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzPopconfirmModule,
    NzTableModule,
    NzModalModule,
    NzMessageModule,
    NzIconModule,
    PageHeaderComponent,
    AmountFormatPipe,
    CurrencyFormatPipe,
  ],
  templateUrl: './planned-payments-container.component.html',
  styleUrls: ['./planned-payments-container.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlannedPaymentsContainerComponent implements OnInit {
  plannedPayments$ = this.plannedPaymentsFacadeService.plannedPayments$;

  isLoading$ = this.plannedPaymentsFacadeService.isLoading$;

  pagination$ = this.plannedPaymentsFacadeService.pagination$;

  actions: PageHeaderActionInterface[] = [
    {
      label: 'Add planned payment',
      type: 'primary',
      action: () => {
        this.onAddPlannedPayment();
      },
    },
  ];

  readonly PERIOD_TO_LABEL = PERIOD_TO_LABEL;
  readonly RECORD_TYPE_TO_LABEL = RECORD_TYPE_TO_LABEL;

  constructor(
    private plannedPaymentsFacadeService: PlannedPaymentsFacadeService,
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

        this.plannedPaymentsFacadeService.updatePagination(page, size);

        this.plannedPaymentsFacadeService.loadPlannedPayments();
      }
    });
  }

  onAddPlannedPayment(): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Add new planned payment',
      nzContent: AddPlannedPaymentModalComponent,
      nzCentered: true,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.plannedPaymentsFacadeService.loadPlannedPayments();

        this.messageService.success('Planned payment was created');
      }
    });
  }

  onEditPlannedPayment(plannedPayment: PlannedPaymentModel): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Edit planned payment',
      nzContent: EditPlannedPaymentModalComponent,
      nzCentered: true,
      nzData: plannedPayment,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.plannedPaymentsFacadeService.loadPlannedPayments();

        this.messageService.success('Planned payment was updated');
      }
    });
  }

  onDeletePlannedPayment(plannedPayment: PlannedPaymentModel): void {
    this.plannedPaymentsFacadeService.deletePlannedPayment$(plannedPayment.id).subscribe(() => {
      this.plannedPaymentsFacadeService.loadPlannedPayments();

      this.messageService.success('Planned payment item was deleted');
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
