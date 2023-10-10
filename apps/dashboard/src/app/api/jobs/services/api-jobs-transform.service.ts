import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';

import { SynchronizationJobInterface } from '@financial-project/common';

import { SynchronizationJobModel } from '../models/synchronization-job.model';
import { TriggerSynchronizationJobType } from '../types/api-jobs.types';

@Injectable({
  providedIn: 'root',
})
export class ApiJobsTransformService {
  toTriggerSynchronizationForAccount(id: string, fromDate: Date, toDate: Date): TriggerSynchronizationJobType {
    return {
      accountId: id,
      fromDate,
      toDate,
    };
  }

  fromTriggerSynchronizationForAccount(response: SynchronizationJobInterface): SynchronizationJobModel {
    return this.toSynchronizationJobModel(response);
  }

  fromExtractSynchronizationJob(response: SynchronizationJobInterface): SynchronizationJobModel {
    return this.toSynchronizationJobModel(response);
  }

  private toSynchronizationJobModel(plain: SynchronizationJobInterface): SynchronizationJobModel {
    return plainToInstance(SynchronizationJobModel, plain);
  }
}
