import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PlannedPaymentSnapshotModel } from '../../api/planned-payment-snapshots/models/planned-payment-snapshot.model';
import { ApiPlannedPaymentSnapshotsService } from '../../api/planned-payment-snapshots/services/api-planned-payment-snapshots.service';
import { PaginatedResponse } from '../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../core/pagination/interfaces/pagination-params.interface';

@Injectable({
  providedIn: 'root',
})
export class PlannedPaymentSnapshotsService {
  private apiPlannedPaymentSnapshotsService = inject(ApiPlannedPaymentSnapshotsService);

  getPlannedPaymentSnapshots$(
    pagination?: PaginationParamsInterface,
  ): Observable<PaginatedResponse<PlannedPaymentSnapshotModel>> {
    return this.apiPlannedPaymentSnapshotsService.extractPlannedPaymentSnapshots$(pagination);
  }

  savePlannedPaymentSnapshot$(
    plannedPaymentToSave: PlannedPaymentSnapshotModel,
  ): Observable<PlannedPaymentSnapshotModel> {
    return this.apiPlannedPaymentSnapshotsService.insertPlannedPaymentSnapshot$(plannedPaymentToSave);
  }

  deletePlannedPayment$(id: string): Observable<PlannedPaymentSnapshotModel> {
    return this.apiPlannedPaymentSnapshotsService.deletePlannedPaymentSnapshot$(id);
  }
}
