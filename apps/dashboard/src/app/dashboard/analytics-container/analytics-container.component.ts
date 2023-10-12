import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateTime } from 'luxon';
import { take } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { AnalyticsFacadeService } from './services/analytics-facade.service';

@Component({
  selector: 'fpd-analytics-container',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzInputModule,
    NzButtonModule,
    NzDatePickerModule,
  ],
  templateUrl: './analytics-container.component.html',
  styleUrls: ['./analytics-container.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsContainerComponent implements OnInit {
  filterForm = new FormGroup({
    accounts: new FormControl(),
    month: new FormControl(),
  });

  analyticsFacadeService = inject(AnalyticsFacadeService);

  accounts$ = this.analyticsFacadeService.accounts$;
  summary$ = this.analyticsFacadeService.summary$;
  prevSummary$ = this.analyticsFacadeService.prevSummary$;
  settings$ = this.analyticsFacadeService.settings$;

  ngOnInit(): void {
    this.analyticsFacadeService.initialize();
  }

  onFilter(): void {
    this.settings$.pipe(take(1)).subscribe((settings) => {
      if (settings) {
        const fromDate = DateTime.fromJSDate(this.filterForm.value.month)
          .setZone('utc')
          .set({
            day: settings.billingPeriodStartDayNumber,
          })
          .startOf('day');

        const toDate = fromDate
          .plus({ month: 1 })
          .set({
            day: settings.billingPeriodStartDayNumber - 1,
          })
          .endOf('day');

        const prevFromDate = fromDate.minus({ month: 1 });
        const prevToDate = toDate.minus({ month: 1 });

        this.analyticsFacadeService.setSelectedAccounts(this.filterForm.value.accounts);
        this.analyticsFacadeService.setDateRange(
          fromDate.toJSDate(),
          toDate.toJSDate(),
          prevFromDate.toJSDate(),
          prevToDate.toJSDate()
        );
        this.analyticsFacadeService.loadSummary();
      }
    });
  }
}
