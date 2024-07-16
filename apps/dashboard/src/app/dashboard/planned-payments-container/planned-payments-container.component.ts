import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

import { RoutePathEnum } from '../../core/routing/enums/route-path.enum';
import { PageHeaderActionInterface } from '../../shared/components/page-header/interfaces/page-header-action.interface';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { AddPlannedPaymentModalComponent } from './components/add-planned-payment-modal/add-planned-payment-modal.component';
import { PlannedPaymentsCalendarTabComponent } from './components/planned-payments-calendar-tab/planned-payments-calendar-tab.component';
import { PlannedPaymentsTableTabComponent } from './components/planned-payments-table-tab/planned-payments-table-tab.component';
import { PlannedPaymentsFacadeService } from './services/planned-payments-facade.service';

@Component({
  selector: 'fpd-planned-payments-container',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzTabsModule,
    PageHeaderComponent,
    PlannedPaymentsTableTabComponent,
    PlannedPaymentsCalendarTabComponent,
  ],
  templateUrl: './planned-payments-container.component.html',
  styleUrls: ['./planned-payments-container.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlannedPaymentsContainerComponent {
  actions: PageHeaderActionInterface[] = [
    {
      label: 'Add planned payment',
      type: 'primary',
      action: () => {
        this.onAddPlannedPayment();
      },
    },
  ];

  readonly RoutePathEnum = RoutePathEnum;

  constructor(
    private plannedPaymentsFacadeService: PlannedPaymentsFacadeService,
    private modalService: NzModalService,
    private messageService: NzMessageService,
  ) {}

  onAddPlannedPayment(): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Add new planned payment',
      nzContent: AddPlannedPaymentModalComponent,
      nzCentered: true,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.plannedPaymentsFacadeService.reloadPlannedPayments();

        this.messageService.success('Planned payment was created');
      }
    });
  }
}
