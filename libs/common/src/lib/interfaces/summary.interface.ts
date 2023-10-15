import { RecordInterface } from './record.interface';

export interface SummaryInterface {
  fromDate: Date;
  toDate: Date;
  income: number;
  outcome: number;
  incomeRecordsCount: number;
  outcomeRecordsCount: number;
  recordsCount: number;
  outcomeRecords: RecordInterface[];
  incomeRecords: RecordInterface[];
}
