import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DateTime } from 'luxon';

import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { PeriodEnum, RecordTypeEnum } from '@financial-project/common';

import { PlannedPaymentModel } from '../../../api/planned-payments/models/planned-payment.model';
import { AmountFormatPipe } from '../../pipes/amount-format/amount-format.pipe';
import { CurrencyFormatPipe } from '../../pipes/currency-format/currency-format.pipe';

@Component({
  selector: 'fpd-planned-payments-calendar',
  standalone: true,
  imports: [NzCalendarModule, AmountFormatPipe, CurrencyFormatPipe, NzIconModule],
  templateUrl: './planned-payments-calendar.component.html',
  styleUrl: './planned-payments-calendar.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlannedPaymentsCalendarComponent {
  plannedPayments = input.required<PlannedPaymentModel[]>();

  private data = computed(() => {
    const plannedPayments = this.plannedPayments();

    const processedData = new Map<string, PlannedPaymentModel[]>();

    for (const plannedPayment of plannedPayments) {
      switch (plannedPayment.period) {
        case PeriodEnum.OneTime: {
          this.setPlannedPaymentToProcessedData(
            processedData,
            this.getOneTimePaymentKey(plannedPayment.dateOfYear!),
            plannedPayment,
          );
          break;
        }

        case PeriodEnum.Yearly: {
          this.setPlannedPaymentToProcessedData(
            processedData,
            this.getYearlyPaymentKey(plannedPayment.dateOfYear!),
            plannedPayment,
          );
          break;
        }

        case PeriodEnum.Monthly: {
          this.setPlannedPaymentToProcessedData(
            processedData,
            this.getMonthlyPaymentKey(plannedPayment.dayOfMonth!),
            plannedPayment,
          );
          break;
        }

        case PeriodEnum.Weekly: {
          this.setPlannedPaymentToProcessedData(
            processedData,
            this.getWeeklyPaymentKey(plannedPayment.dayOfWeek!),
            plannedPayment,
          );
          break;
        }
      }
    }

    return processedData;
  });

  setPlannedPaymentToProcessedData(
    processedData: Map<string, PlannedPaymentModel[]>,
    key: string,
    plannedPayment: PlannedPaymentModel,
  ): void {
    if (processedData.has(key)) {
      processedData.get(key)?.push(plannedPayment);
    } else {
      processedData.set(key, [plannedPayment]);
    }
  }

  getPlannedPaymentsForDate(date: Date): PlannedPaymentModel[] {
    const plannedPaymentsMap = this.data();

    const plannedPayments: PlannedPaymentModel[] = [];

    const dt = DateTime.fromJSDate(date);

    const monthly = plannedPaymentsMap.get(this.getMonthlyPaymentKey(dt.get('day')));
    const weekly = plannedPaymentsMap.get(this.getWeeklyPaymentKey(dt.get('weekday')));
    const yearly = plannedPaymentsMap.get(this.getYearlyPaymentKey(date));
    const oneTime = plannedPaymentsMap.get(this.getOneTimePaymentKey(date));

    if (monthly?.length) {
      plannedPayments.push(...monthly);
    }

    if (weekly?.length) {
      plannedPayments.push(...weekly);
    }

    if (yearly?.length) {
      plannedPayments.push(...yearly);
    }

    if (oneTime?.length) {
      plannedPayments.push(...oneTime);
    }

    return plannedPayments;
  }

  getMonthlyPaymentKey(dayOfMonth: number): string {
    return `${PeriodEnum.Monthly}.${dayOfMonth}`;
  }

  getWeeklyPaymentKey(dayOfWeek: number): string {
    return `${PeriodEnum.Weekly}.${dayOfWeek}`;
  }

  getYearlyPaymentKey(dateOfYear: Date): string {
    return `${PeriodEnum.Yearly}.${DateTime.fromJSDate(dateOfYear).toFormat('yyyy-MM-dd')}`;
  }

  getOneTimePaymentKey(dateOfYear: Date): string {
    return `${PeriodEnum.OneTime}.${DateTime.fromJSDate(dateOfYear).toFormat('yyyy-MM-dd')}`;
  }

  protected readonly RecordTypeEnum = RecordTypeEnum;
}
