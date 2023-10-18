import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';

import { RecordTypeEnum } from '@financial-project/common';

import { SummaryModel } from '../../../../api/analytics/models/summary.model';
import { RecordModel } from '../../../../api/records/models/record.model';
import { AmountFormatPipe } from '../../../../shared/pipes/amount-format/amount-format.pipe';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format/currency-format.pipe';

@Component({
  selector: 'fpd-latest-records-widget',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzSpinModule,
    NzSkeletonModule,
    AmountFormatPipe,
    CurrencyFormatPipe,
    NzIconModule,
  ],
  templateUrl: './latest-records-widget.component.html',
  styleUrls: ['./latest-records-widget.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LatestRecordsWidgetComponent implements OnChanges {
  @Input()
  summary: SummaryModel | null = null;

  @Input()
  label = '';

  records: RecordModel[] = [];

  protected readonly RecordTypeEnum = RecordTypeEnum;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['summary'].currentValue) {
      const summary = changes['summary'].currentValue as SummaryModel;

      this.records = [...summary.incomeRecords, ...summary.outcomeRecords].sort((a, b) =>
        b.bankCreatedAt && a.bankCreatedAt
          ? b.bankCreatedAt.getTime() - a.bankCreatedAt.getTime()
          : b.createdAt.getTime() - a.createdAt.getTime()
      );
    }
  }
}
