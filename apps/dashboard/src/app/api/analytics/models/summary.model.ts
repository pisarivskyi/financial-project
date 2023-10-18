import { Expose, Type } from 'class-transformer';

import { SummaryInterface } from '@financial-project/common';

import { RecordModel } from '../../records/models/record.model';

export class SummaryModel implements SummaryInterface {
  @Expose()
  @Type(() => Date)
  fromDate!: Date;

  @Expose()
  @Type(() => Date)
  toDate!: Date;

  @Expose()
  income!: number;

  @Expose()
  outcome!: number;

  @Expose()
  incomeRecordsCount!: number;

  @Expose()
  outcomeRecordsCount!: number;

  @Expose()
  recordsCount!: number;

  @Expose()
  @Type(() => RecordModel)
  outcomeRecords!: RecordModel[];

  @Expose()
  @Type(() => RecordModel)
  incomeRecords!: RecordModel[];
}
