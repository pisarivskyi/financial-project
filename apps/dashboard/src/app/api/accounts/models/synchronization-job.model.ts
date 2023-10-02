import { SynchronizationJobInterface } from '@financial-project/common';

export class SynchronizationJobModel implements SynchronizationJobInterface {
  id!: string;
  name!: string;
  progress!: number;
  delay!: number;
  timestamp!: number;
  attemptsMade!: number;
  stacktrace!: any[];
  returnvalue!: any;
  finishedOn!: number;
  processedOn!: number;
}
