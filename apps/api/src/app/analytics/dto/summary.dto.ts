import { SummaryInterface } from '@financial-project/common';

import { RecordEntity } from '../../records/entities/record.entity';

export class SummaryDto implements SummaryInterface {
  fromDate: Date;
  toDate: Date;
  income: number;
  outcome: number;
  incomeRecordsCount: number;
  outcomeRecordsCount: number;
  recordsCount: number;
  outcomeRecords: RecordEntity[];
  incomeRecords: RecordEntity[];
}
