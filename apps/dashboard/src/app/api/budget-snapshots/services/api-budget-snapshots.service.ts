import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { BudgetSnapshotInterface, PaginatedResponseInterface } from '@financial-project/common';

import { HttpMethodEnum } from '../../../core/communication/enums/http-method.enum';
import { CommunicationService } from '../../../core/communication/services/communication.service';
import { PaginatedResponse } from '../../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../../core/pagination/interfaces/pagination-params.interface';
import { BudgetSnapshotModel } from '../models/budget-snapshot.model';
import { ApiBudgetSnapshotsTransformService } from './api-budget-snapshots-transform.service';

@Injectable({
  providedIn: 'root',
})
export class ApiBudgetSnapshotsService {
  readonly requests = {
    budgetSnapshots: '/budget-snapshots',
    deleteBudgetSnapshot: (id: string) => `/budget-snapshots/${id}`,
  };

  constructor(
    private apiBudgetSnapshotsTransformService: ApiBudgetSnapshotsTransformService,
    private communicationService: CommunicationService,
  ) {}

  extractBudgetSnapshots$(pagination?: PaginationParamsInterface): Observable<PaginatedResponse<BudgetSnapshotModel>> {
    return this.communicationService
      .makeRequest<PaginatedResponseInterface<BudgetSnapshotInterface>>({
        method: HttpMethodEnum.Get,
        path: this.requests.budgetSnapshots,
        params: this.apiBudgetSnapshotsTransformService.toExtractBudgetSnapshotsParams(pagination),
      })
      .pipe(map((response) => this.apiBudgetSnapshotsTransformService.fromExtractBudgetSnapshots(response)));
  }

  insertBudgetSnapshot$(budgetSnapshotToSave: BudgetSnapshotModel): Observable<BudgetSnapshotModel> {
    return this.communicationService
      .makeRequest<BudgetSnapshotInterface>({
        method: HttpMethodEnum.Post,
        path: this.requests.budgetSnapshots,
        payload: this.apiBudgetSnapshotsTransformService.toInsertBudgetSnapshot(budgetSnapshotToSave),
      })
      .pipe(map((response) => this.apiBudgetSnapshotsTransformService.fromInsertBudgetSnapshot(response)));
  }

  deleteBudgetSnapshot$(id: string): Observable<BudgetSnapshotModel> {
    return this.communicationService
      .makeRequest<BudgetSnapshotInterface>({
        method: HttpMethodEnum.Delete,
        path: this.requests.deleteBudgetSnapshot(id),
      })
      .pipe(map((response) => this.apiBudgetSnapshotsTransformService.fromDeleteBudget(response)));
  }
}
