import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BudgetSnapshotModel } from '../../api/budget-snapshots/models/budget-snapshot.model';
import { ApiBudgetSnapshotsService } from '../../api/budget-snapshots/services/api-budget-snapshots.service';
import { PaginatedResponse } from '../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../core/pagination/interfaces/pagination-params.interface';

@Injectable({
  providedIn: 'root',
})
export class BudgetSnapshotsService {
  constructor(private apiBudgetSnapshotsService: ApiBudgetSnapshotsService) {}

  getBudgetSnapshots$(pagination?: PaginationParamsInterface): Observable<PaginatedResponse<BudgetSnapshotModel>> {
    return this.apiBudgetSnapshotsService.extractBudgetSnapshots$(pagination);
  }

  saveBudgetSnapshot$(categoryToSave: BudgetSnapshotModel): Observable<BudgetSnapshotModel> {
    return this.apiBudgetSnapshotsService.insertBudgetSnapshot$(categoryToSave);
  }

  deleteBudgetSnapshot$(id: string): Observable<BudgetSnapshotModel> {
    return this.apiBudgetSnapshotsService.deleteBudgetSnapshot$(id);
  }
}
