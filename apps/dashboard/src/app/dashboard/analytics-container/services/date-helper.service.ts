import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class DateHelperService {
  getBillingMonthDateRange(month: Date, billingPeriodStartDayNumber: number): Date[] {
    const fromDate = DateTime.fromJSDate(month)
      .setZone('utc')
      .set({
        day: billingPeriodStartDayNumber,
      })
      .startOf('day');

    const toDate = fromDate
      .plus({ month: 1 })
      .set({
        day: billingPeriodStartDayNumber - 1,
      })
      .endOf('day');

    return [fromDate.toJSDate(), toDate.toJSDate()];
  }

  getBillingMonthDateRangesForFullYear(date: Date, billingPeriodStartDayNumber: number): Map<number, Date[]> {
    const year = date.getFullYear();

    const fullYearRanges = new Map<number, Date[]>();

    for (let month = 0; month <= 12; month += 1) {
      fullYearRanges.set(month, this.getBillingMonthDateRange(new Date(year, month), billingPeriodStartDayNumber));
    }

    return fullYearRanges;
  }
}
