import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateTime } from 'luxon';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { AccountModel } from '../../../../api/accounts/models/account.model';
import { SettingsModel } from '../../../../api/settings/models/settings.model';
import { AnalyticsFiltersInterface } from '../../services/analytics-facade.service';

@Component({
  selector: 'fpd-filters',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzDatePickerModule,
    NzFormModule,
    NzGridModule,
    NzSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  @Input()
  accounts: AccountModel[] | null = null;

  @Input()
  settings: SettingsModel | null = null;

  @Output()
  filter = new EventEmitter<AnalyticsFiltersInterface>();

  filterForm = new FormGroup({
    accounts: new FormControl(),
    month: new FormControl(),
  });

  onFilter(): void {
    if (this.settings) {
      const { accounts, month } = this.filterForm.value;

      const fromDate = DateTime.fromJSDate(month)
        .setZone('utc')
        .set({
          day: this.settings.billingPeriodStartDayNumber,
        })
        .startOf('day');

      const toDate = fromDate
        .plus({ month: 1 })
        .set({
          day: this.settings.billingPeriodStartDayNumber - 1,
        })
        .endOf('day');

      const prevFromDate = fromDate.minus({ month: 1 });
      const prevToDate = toDate.minus({ month: 1 });

      this.filter.emit({
        fromDate: fromDate.toJSDate(),
        toDate: toDate.toJSDate(),
        prevFromDate: prevFromDate.toJSDate(),
        prevToDate: prevToDate.toJSDate(),
        selectedAccounts: accounts,
      });
    }
  }
}
