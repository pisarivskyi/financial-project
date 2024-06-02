import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { PaginatedResponseInterface, PlannedPaymentSnapshotInterface } from '@financial-project/common';

import { HttpMethodEnum } from '../../../core/communication/enums/http-method.enum';
import { CommunicationService } from '../../../core/communication/services/communication.service';
import { PaginatedResponse } from '../../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../../core/pagination/interfaces/pagination-params.interface';
import { PlannedPaymentSnapshotModel } from '../models/planned-payment-snapshot.model';
import { ApiPlannedPaymentSnapshotsTransformService } from './api-planned-payment-snapshots-transform.service';

@Injectable({
  providedIn: 'root',
})
export class ApiPlannedPaymentSnapshotsService {
  readonly requests = {
    plannedPaymentSnapshots: '/planned-payment-snapshots',
    deletePlannedPaymentSnapshot: (id: string) => `/planned-payment-snapshots/${id}`,
  };

  constructor(
    private apiPlannedPaymentSnapshotsTransformService: ApiPlannedPaymentSnapshotsTransformService,
    private communicationService: CommunicationService,
  ) {}

  extractPlannedPaymentSnapshots$(
    pagination?: PaginationParamsInterface,
  ): Observable<PaginatedResponse<PlannedPaymentSnapshotModel>> {
    return this.communicationService
      .makeRequest<PaginatedResponseInterface<PlannedPaymentSnapshotInterface>>({
        method: HttpMethodEnum.Get,
        path: this.requests.plannedPaymentSnapshots,
        params: this.apiPlannedPaymentSnapshotsTransformService.toExtractPlannedPaymentSnapshotsParams(pagination),
      })
      .pipe(
        map((response) => this.apiPlannedPaymentSnapshotsTransformService.fromExtractPlannedPaymentSnapshots(response)),
      );
  }

  insertPlannedPaymentSnapshot$(
    plannedPaymentSnapshotToSave: PlannedPaymentSnapshotModel,
  ): Observable<PlannedPaymentSnapshotModel> {
    return this.communicationService
      .makeRequest<PlannedPaymentSnapshotInterface>({
        method: HttpMethodEnum.Post,
        path: this.requests.plannedPaymentSnapshots,
        payload:
          this.apiPlannedPaymentSnapshotsTransformService.toInsertPlannedPaymentSnapshot(plannedPaymentSnapshotToSave),
      })
      .pipe(
        map((response) => this.apiPlannedPaymentSnapshotsTransformService.fromInsertPlannedPaymentSnapshot(response)),
      );
  }

  deletePlannedPaymentSnapshot$(id: string): Observable<PlannedPaymentSnapshotModel> {
    return this.communicationService
      .makeRequest<PlannedPaymentSnapshotInterface>({
        method: HttpMethodEnum.Delete,
        path: this.requests.deletePlannedPaymentSnapshot(id),
      })
      .pipe(map((response) => this.apiPlannedPaymentSnapshotsTransformService.fromDeletePlannedPayment(response)));
  }
}
