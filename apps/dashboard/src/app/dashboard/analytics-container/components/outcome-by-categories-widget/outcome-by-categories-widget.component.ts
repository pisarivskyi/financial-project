import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
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
  imports: [NzTableModule, NzSpinModule, NzSkeletonModule, AmountFormatPipe, CurrencyFormatPipe, NgChartsModule],
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

  ngOnChanges(): void {
    this.initData();
  }

  private initData(): void {
    if (this.summary && this.categories) {
      // find root categories
      const rootCategories = this.categories.filter((category) => !category.parentCategory);
      // get child categories
      const childrenCategories = this.categories.filter((category) => category.parentCategory);

      // prepare some maps data
      const categoryIdToAmountMap = new Map<string, number>();
      const categoryIdToCategoryMap = new Map<string, CategoryModel>(
        rootCategories.map((category) => [category.id, category]),
      );
      const childCategoryIdToParentCategoryIdMap = new Map<string, string>(
        childrenCategories.map((category) => [category.id, category.parentCategory.id]),
      );
      let withoutCategoryAmount = 0;

      for (const record of this.summary.outcomeRecords) {
        if (record.category) {
          // check if category of the record is child category, then get its parent category value, otherwise it's parent category
          const categoryId = childCategoryIdToParentCategoryIdMap.get(record.category.id) ?? record.category.id;

          const existingCategoryAmount = categoryIdToAmountMap.get(categoryId);

          if (existingCategoryAmount) {
            categoryIdToAmountMap.set(categoryId, existingCategoryAmount + record.amount);
          } else {
            categoryIdToAmountMap.set(categoryId, record.amount);
          }
        } else {
          withoutCategoryAmount += record.amount;
        }
      }

      const pieCategories = Array.from(categoryIdToAmountMap.keys()).map((id) => categoryIdToCategoryMap.get(id)!);

      this.pieChartData = {
        labels: [
          ...(withoutCategoryAmount ? [this.withoutCategoryName] : []),
          ...pieCategories.map((category) => category.name),
        ],
        datasets: [
          {
            data: [
              ...(withoutCategoryAmount ? [withoutCategoryAmount / 100] : []),
              ...Array.from(categoryIdToAmountMap.values()).map((amount) => amount / 100),
            ],
            backgroundColor: [
              ...(withoutCategoryAmount ? [this.withoutCategoryColor] : []),
              ...pieCategories.map((category) => category.color),
            ],
          },
        ],
      };
    }
  }
}
