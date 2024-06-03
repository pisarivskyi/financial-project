import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { PlannedPaymentsCalendarComponent } from '../../../../shared/components/planned-payments-calendar/planned-payments-calendar.component';
import { PlannedPaymentsFacadeService } from '../../services/planned-payments-facade.service';

@Component({
  selector: 'fpd-planned-payments-calendar-tab',
  standalone: true,
  imports: [AsyncPipe, PlannedPaymentsCalendarComponent],
  templateUrl: './planned-payments-calendar-tab.component.html',
  styleUrl: './planned-payments-calendar-tab.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlannedPaymentsCalendarTabComponent implements OnInit {
  private plannedPaymentsFacadeService = inject(PlannedPaymentsFacadeService);

  plannedPayments$ = this.plannedPaymentsFacadeService.allPlannedPayments$;

  ngOnInit(): void {
    this.plannedPaymentsFacadeService.loadAllPlannedPayments();
  }
}
