import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { SummaryModel } from '../../../../api/analytics/models/summary.model';
import { AmountFormatPipe } from '../../../../shared/pipes/amount-format/amount-format.pipe';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format/currency-format.pipe';

export enum SummaryCardWidgetTypeEnum {
  Income,
  Outcome,
}

@Component({
  selector: 'fpd-summary-card-widget',
  standalone: true,
  imports: [CommonModule, AmountFormatPipe, CurrencyFormatPipe],
  templateUrl: './summary-card-widget.component.html',
  styleUrls: ['./summary-card-widget.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryCardWidgetComponent implements OnChanges {
  @Input()
  summary: SummaryModel | null = null;

  @Input()
  prevSummary: SummaryModel | null = null;

  @Input()
  label = '';

  @Input()
  type: SummaryCardWidgetTypeEnum = SummaryCardWidgetTypeEnum.Income;

  protected readonly SummaryCardWidgetTypeEnum = SummaryCardWidgetTypeEnum;

  currentPeriodSum = 0;

  prevPeriodSum = 0;

  percentage = 0;
  percentageSign = 0;

  ngOnChanges(changes: SimpleChanges): void {
    this.initData();
  }

  private initData(): void {
    if (this.summary && this.prevSummary) {
      if (this.type === SummaryCardWidgetTypeEnum.Income) {
        this.currentPeriodSum = this.summary.income;
        this.prevPeriodSum = this.prevSummary.income;
      } else if (this.type === SummaryCardWidgetTypeEnum.Outcome) {
        this.currentPeriodSum = this.summary.outcome;
        this.prevPeriodSum = this.prevSummary.outcome;
      }

      const tempPercentage = (this.currentPeriodSum - this.prevPeriodSum) / this.prevPeriodSum;
      this.percentage = Math.abs(tempPercentage);
      this.percentageSign = Math.sign(tempPercentage);
    }
  }
}
