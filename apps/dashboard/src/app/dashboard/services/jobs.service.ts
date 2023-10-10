import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SynchronizationJobModel } from '../../api/jobs/models/synchronization-job.model';
import { ApiJobsService } from '../../api/jobs/services/api-jobs.service';

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  constructor(private apiJobsService: ApiJobsService) {}

  triggerSynchronizationForAccount$(id: string, fromDate: Date, toDate: Date): Observable<SynchronizationJobModel> {
    return this.apiJobsService.triggerSynchronizationForAccount$(id, fromDate, toDate);
  }

  getSynchronizationJob$(id: string): Observable<SynchronizationJobModel> {
    return this.apiJobsService.extractSynchronizationJob$(id);
  }
}
