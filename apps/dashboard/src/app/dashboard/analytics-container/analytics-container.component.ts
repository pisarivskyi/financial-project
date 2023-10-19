import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { BudgetsWidgetComponent } from './components/budgets-widget/budgets-widget.component';
import { FiltersComponent } from './components/filters/filters.component';
import { LatestRecordsWidgetComponent } from './components/latest-records-widget/latest-records-widget.component';
import { OutcomeByCategoriesWidgetComponent } from './components/outcome-by-categories-widget/outcome-by-categories-widget.component';
import {
  SummaryCardWidgetComponent,
  SummaryCardWidgetTypeEnum,
} from './components/summary-card-widget/summary-card-widget.component';
import { YearStatWidgetComponent } from './components/year-stat-widget/year-stat-widget.component';
import { AnalyticsFacadeService, AnalyticsFiltersInterface } from './services/analytics-facade.service';

@Component({
  selector: 'fpd-analytics-container',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    LatestRecordsWidgetComponent,
    SummaryCardWidgetComponent,
    FiltersComponent,
    OutcomeByCategoriesWidgetComponent,
    BudgetsWidgetComponent,
    YearStatWidgetComponent,
  ],
  templateUrl: './analytics-container.component.html',
  styleUrls: ['./analytics-container.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsContainerComponent implements OnInit {
  analyticsFacadeService = inject(AnalyticsFacadeService);

  accounts$ = this.analyticsFacadeService.accounts$;
  categories$ = this.analyticsFacadeService.categories$;
  budgets$ = this.analyticsFacadeService.budgets$;
  summary$ = this.analyticsFacadeService.summary$;
  prevSummary$ = this.analyticsFacadeService.prevSummary$;
  settings$ = this.analyticsFacadeService.settings$;
  yearSummaries$ = this.analyticsFacadeService.yearSummaries$;
  filters$ = this.analyticsFacadeService.filters$;

  protected readonly SummaryCardWidgetTypeEnum = SummaryCardWidgetTypeEnum;

  ngOnInit(): void {
    this.analyticsFacadeService.initialize();
  }

  onFilter(filters: AnalyticsFiltersInterface): void {
    if (filters) {
      this.analyticsFacadeService.setSelectedAccounts(filters.selectedAccounts);
      this.analyticsFacadeService.setDateRange(
        filters.fromDate,
        filters.toDate,
        filters.prevFromDate,
        filters.prevToDate
      );
      this.analyticsFacadeService.loadFullYearSummary();
    }
  }
}
