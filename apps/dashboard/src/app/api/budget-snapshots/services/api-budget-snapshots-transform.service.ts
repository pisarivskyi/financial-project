import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';

import { BudgetSnapshotInterface, PaginatedResponseInterface } from '@financial-project/common';

import { PaginatedResponse } from '../../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../../core/pagination/interfaces/pagination-params.interface';
import { toPaginationQueryParams } from '../../../core/pagination/utils/pagination-utils';
import { BudgetSnapshotModel } from '../models/budget-snapshot.model';
import { InsertBudgetSnapshotDataType } from '../types/api-budget-snapshots.types';

@Injectable({
  providedIn: 'root',
})
export class ApiBudgetSnapshotsTransformService {
  fromExtractBudgetSnapshots(
    response: PaginatedResponseInterface<BudgetSnapshotInterface>,
  ): PaginatedResponse<BudgetSnapshotModel> {
    return new PaginatedResponse<BudgetSnapshotModel>(
      response.data.map((d) => this.toBudgetSnapshotModel(d)),
      response.meta,
    );
  }

  toExtractBudgetSnapshotsParams(pagination?: PaginationParamsInterface) {
    return new HttpParams({
      fromObject: toPaginationQueryParams(pagination),
    });
  }

  fromInsertBudgetSnapshot(response: BudgetSnapshotInterface): BudgetSnapshotModel {
    return this.toBudgetSnapshotModel(response);
  }

  toInsertBudgetSnapshot({ id }: BudgetSnapshotModel): InsertBudgetSnapshotDataType {
    return {
      originalId: id,
    };
  }

  fromDeleteBudget(response: BudgetSnapshotInterface): BudgetSnapshotModel {
    return this.toBudgetSnapshotModel(response);
  }

  private toBudgetSnapshotModel(plain: BudgetSnapshotInterface): BudgetSnapshotModel {
    return plainToInstance(BudgetSnapshotModel, plain);
  }
}
