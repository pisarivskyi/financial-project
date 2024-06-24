import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

import { PeriodEnum } from '@financial-project/common';

import { PlannedPaymentModel } from '../../api/planned-payments/models/planned-payment.model';

@Injectable({
  providedIn: 'root',
})
export class PlannedPaymentsHelpersService {
  processPlannedPayments(plannedPayments: PlannedPaymentModel[]): Map<string, PlannedPaymentModel[]> {
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
  }

  getPlannedPaymentsForDate(plannedPaymentsMap: Map<string, PlannedPaymentModel[]>, date: Date): PlannedPaymentModel[] {
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

  private setPlannedPaymentToProcessedData(
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

  private getMonthlyPaymentKey(dayOfMonth: number): string {
    return `${PeriodEnum.Monthly}.${dayOfMonth}`;
  }

  private getWeeklyPaymentKey(dayOfWeek: number): string {
    return `${PeriodEnum.Weekly}.${dayOfWeek}`;
  }

  private getYearlyPaymentKey(dateOfYear: Date): string {
    return `${PeriodEnum.Yearly}.${DateTime.fromJSDate(dateOfYear).toFormat('yyyy-MM-dd')}`;
  }

  private getOneTimePaymentKey(dateOfYear: Date): string {
    return `${PeriodEnum.OneTime}.${DateTime.fromJSDate(dateOfYear).toFormat('yyyy-MM-dd')}`;
  }
}
