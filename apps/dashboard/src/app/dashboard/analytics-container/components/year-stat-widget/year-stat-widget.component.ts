import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DateTime } from 'luxon';
import { NgChartsModule } from 'ng2-charts';

import { SummaryModel } from '../../../../api/analytics/models/summary.model';
import { AnalyticsFiltersInterface } from '../../services/analytics-facade.service';

@Component({
  selector: 'fpd-year-stat-widget',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './year-stat-widget.component.html',
  styleUrls: ['./year-stat-widget.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearStatWidgetComponent implements OnChanges {
  @Input()
  label = '';

  @Input()
  filters: AnalyticsFiltersInterface | null = null;

  @Input()
  summaries: SummaryModel[] | null = [];

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {},
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [];

  public barChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [],
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.initData();
  }

  private initData(): void {
    if (this.summaries?.length && this.filters) {
      const startOfYear = DateTime.fromJSDate(this.filters.fromDate).startOf('year');
      const endOfYear = startOfYear.endOf('year');

      const currentData = this.summaries.filter(
        (summary) =>
          summary.fromDate.getTime() > startOfYear.toJSDate().getTime() &&
          summary.fromDate.getTime() < endOfYear.toJSDate().getTime()
      );

      // const prevData = this.summaries.slice(0, this.summaries.length - 1)

      this.barChartData = {
        labels: currentData.map((summary) => `${summary.fromDate.getFullYear()}-${summary.fromDate.getMonth() + 1}`),
        datasets: [
          { data: currentData.map((summary) => summary.income / 100), label: 'Income' },
          { data: currentData.map((summary) => summary.outcome / 100), label: 'Outcome' },
        ],
      };
    }
  }
}
