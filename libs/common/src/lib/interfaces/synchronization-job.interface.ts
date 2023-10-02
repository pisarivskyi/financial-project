export interface SynchronizationJobInterface {
  id: string;
  name: string;
  progress: number;
  delay: number;
  timestamp: number;
  attemptsMade: number;
  stacktrace: any[];
  returnvalue: any;
  finishedOn: number;
  processedOn: number;
}
