import { Job, JobNode } from 'bullmq';

import { SynchronizationJobInterface } from '@financial-project/common';

export class SynchronizationJobModel implements SynchronizationJobInterface {
  children!: JobNode[];
  job!: Job;
}
