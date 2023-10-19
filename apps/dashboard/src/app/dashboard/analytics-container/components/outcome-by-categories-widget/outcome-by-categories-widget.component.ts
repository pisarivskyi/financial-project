import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';

import { SummaryModel } from '../../../../api/analytics/models/summary.model';
import { CategoryModel } from '../../../../api/categories/models/category.model';
import { AmountFormatPipe } from '../../../../shared/pipes/amount-format/amount-format.pipe';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format/currency-format.pipe';

@Component({
  selector: 'fpd-outcome-by-categories-widget',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzSpinModule,
    NzSkeletonModule,
    AmountFormatPipe,
    CurrencyFormatPipe,
    NgChartsModule,
  ],
  templateUrl: './outcome-by-categories-widget.component.html',
  styleUrls: ['./outcome-by-categories-widget.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutcomeByCategoriesWidgetComponent implements OnChanges {
  @Input()
  summary: SummaryModel | null = null;

  @Input()
  categories: CategoryModel[] | null = [];

  @Input()
  label = '';

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  };
  pieChartType: ChartType = 'pie';
  pieChartPlugins = [];

  private withoutCategoryName = 'Without category';
  private withoutCategoryColor = '#ccc';

  ngOnChanges(changes: SimpleChanges): void {
    this.initData();
  }

  private initData(): void {
    if (this.summary && this.categories) {
      const categoryIdToAmountMap = new Map<string, number>();
      const categoryIdToCategoryMap = new Map<string, CategoryModel>(
        this.categories.map((category) => [category.id, category])
      );
      let withoutCategoryAmount = 0;

      for (const record of this.summary.outcomeRecords) {
        if (record.category) {
          const existingCategoryAmount = categoryIdToAmountMap.get(record.category.id);

          if (existingCategoryAmount) {
            categoryIdToAmountMap.set(record.category.id, existingCategoryAmount + record.amount);
          } else {
            categoryIdToAmountMap.set(record.category.id, record.amount);
          }
        } else {
          withoutCategoryAmount += record.amount;
        }
      }

      const pieCategories = Array.from(categoryIdToAmountMap.keys()).map((id) => categoryIdToCategoryMap.get(id)!);

      this.pieChartData = {
        labels: [this.withoutCategoryName, ...pieCategories.map((category) => category.name)],
        datasets: [
          {
            data: [withoutCategoryAmount, ...Array.from(categoryIdToAmountMap.values())],
            backgroundColor: [this.withoutCategoryColor, ...pieCategories.map((category) => category.color)],
          },
        ],
      };
    }
  }
}
