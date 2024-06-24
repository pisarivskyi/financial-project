import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { RecordTypeEnum } from '@financial-project/common';

import { PlannedPaymentModel } from '../../../api/planned-payments/models/planned-payment.model';
import { PlannedPaymentsHelpersService } from '../../../dashboard/services/planned-payments-helpers.service';
import { AmountFormatPipe } from '../../pipes/amount-format/amount-format.pipe';
import { CurrencyFormatPipe } from '../../pipes/currency-format/currency-format.pipe';
import { ToDefaultCurrencyPipe } from '../../pipes/to-default-currency/to-default-currency.pipe';

@Component({
  selector: 'fpd-planned-payments-calendar',
  standalone: true,
  imports: [NzCalendarModule, AmountFormatPipe, CurrencyFormatPipe, NzIconModule, ToDefaultCurrencyPipe],
  templateUrl: './planned-payments-calendar.component.html',
  styleUrl: './planned-payments-calendar.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlannedPaymentsCalendarComponent {
  plannedPayments = input.required<PlannedPaymentModel[]>();

  readonly RecordTypeEnum = RecordTypeEnum;

  private plannedPaymentsHelpersService = inject(PlannedPaymentsHelpersService);

  private data = computed(() => {
    const plannedPayments = this.plannedPayments();

    return this.plannedPaymentsHelpersService.processPlannedPayments(plannedPayments);
  });

  getPlannedPaymentsForDate(date: Date): PlannedPaymentModel[] {
    const plannedPaymentsMap = this.data();

    return this.plannedPaymentsHelpersService.getPlannedPaymentsForDate(plannedPaymentsMap, date);
  }
}
