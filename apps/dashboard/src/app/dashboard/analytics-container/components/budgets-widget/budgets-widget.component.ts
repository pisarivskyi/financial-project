import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';

import { SummaryModel } from '../../../../api/analytics/models/summary.model';
import { BudgetModel } from '../../../../api/budgets/models/budget.model';
import { AmountFormatPipe } from '../../../../shared/pipes/amount-format/amount-format.pipe';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format/currency-format.pipe';

interface BudgetStatInterface {
  budget: BudgetModel;
  amount: number;
}

@Component({
  selector: 'fpd-budgets-widget',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzSpinModule, NzSkeletonModule, AmountFormatPipe, CurrencyFormatPipe],
  templateUrl: './budgets-widget.component.html',
  styleUrls: ['./budgets-widget.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetsWidgetComponent implements OnChanges {
  @Input()
  summary: SummaryModel | null = null;

  @Input()
  budgets: BudgetModel[] | null = null;

  @Input()
  label = '';

  budgetStats: BudgetStatInterface[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.initData();
  }

  private initData(): void {
    if (this.summary && this.budgets?.length) {
      const budgetCategoryIds: string[] = [];

      for (const budget of this.budgets) {
        budgetCategoryIds.push(...budget.categories.map((category) => category.id));
      }

      const records = this.summary.outcomeRecords.filter(
        (record) => record.category?.id && budgetCategoryIds.includes(record.category.id)
      );

      const budgetCategoryIdToAmount = new Map<string, number>();

      for (const record of records) {
        const budgetCategoryIdToAmountItem = budgetCategoryIdToAmount.get(record.category!.id);

        if (budgetCategoryIdToAmountItem) {
          budgetCategoryIdToAmount.set(record.category!.id, budgetCategoryIdToAmountItem + record.amount);
        } else {
          budgetCategoryIdToAmount.set(record.category!.id, record.amount);
        }
      }

      for (const budget of this.budgets) {
        this.budgetStats.push({
          budget,
          amount: budget.categories
            .map((category) => budgetCategoryIdToAmount.get(category.id) ?? 0)
            .reduce((acc, item) => acc + item, 0),
        });
      }
    }
  }
}
