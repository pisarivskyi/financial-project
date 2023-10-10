import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { SynchronizationJobInterface } from '@financial-project/common';

import { HttpMethodEnum } from '../../../core/communication/enums/http-method.enum';
import { CommunicationService } from '../../../core/communication/services/communication.service';
import { SynchronizationJobModel } from '../models/synchronization-job.model';
import { ApiJobsTransformService } from './api-jobs-transform.service';

@Injectable({
  providedIn: 'root',
})
export class ApiJobsService {
  readonly requests = {
    jobs: '/jobs',
    getJobById: (id: string) => `/jobs/${id}`,
  };

  constructor(
    private apiJobsTransformService: ApiJobsTransformService,
    private communicationService: CommunicationService
  ) {}

  triggerSynchronizationForAccount$(id: string, fromDate: Date, toDate: Date): Observable<SynchronizationJobModel> {
    return this.communicationService
      .makeRequest<SynchronizationJobInterface>({
        method: HttpMethodEnum.Post,
        path: this.requests.jobs,
        payload: this.apiJobsTransformService.toTriggerSynchronizationForAccount(id, fromDate, toDate),
      })
      .pipe(map((response) => this.apiJobsTransformService.fromTriggerSynchronizationForAccount(response)));
  }

  extractSynchronizationJob$(id: string): Observable<SynchronizationJobModel> {
    return this.communicationService
      .makeRequest<SynchronizationJobInterface>({
        method: HttpMethodEnum.Get,
        path: this.requests.getJobById(id),
      })
      .pipe(map((response) => this.apiJobsTransformService.fromExtractSynchronizationJob(response)));
  }
}
