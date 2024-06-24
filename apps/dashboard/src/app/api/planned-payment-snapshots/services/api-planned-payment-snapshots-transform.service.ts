import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';

import { PaginatedResponseInterface, PlannedPaymentSnapshotInterface } from '@financial-project/common';

import { PaginatedResponse } from '../../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../../core/pagination/interfaces/pagination-params.interface';
import { toPaginationQueryParams } from '../../../core/pagination/utils/pagination-utils';
import { PlannedPaymentSnapshotModel } from '../models/planned-payment-snapshot.model';
import { InsertPlannedPaymentSnapshotDataType } from '../types/api-planned-payment-snapshots.types';

@Injectable({
  providedIn: 'root',
})
export class ApiPlannedPaymentSnapshotsTransformService {
  fromExtractPlannedPaymentSnapshots(
    response: PaginatedResponseInterface<PlannedPaymentSnapshotInterface>,
  ): PaginatedResponse<PlannedPaymentSnapshotModel> {
    return new PaginatedResponse<PlannedPaymentSnapshotModel>(
      response.data.map((d) => this.toPlannedPaymentSnapshotModel(d)),
      response.meta,
    );
  }

  toExtractPlannedPaymentSnapshotsParams(pagination?: PaginationParamsInterface) {
    return new HttpParams({
      fromObject: toPaginationQueryParams(pagination),
    });
  }

  fromInsertPlannedPaymentSnapshot(response: PlannedPaymentSnapshotInterface): PlannedPaymentSnapshotModel {
    return this.toPlannedPaymentSnapshotModel(response);
  }

  toInsertPlannedPaymentSnapshot({ id }: PlannedPaymentSnapshotModel): InsertPlannedPaymentSnapshotDataType {
    return {
      originalId: id,
    };
  }

  fromDeletePlannedPayment(response: PlannedPaymentSnapshotInterface): PlannedPaymentSnapshotModel {
    return this.toPlannedPaymentSnapshotModel(response);
  }

  private toPlannedPaymentSnapshotModel(plain: PlannedPaymentSnapshotInterface): PlannedPaymentSnapshotModel {
    return plainToInstance(PlannedPaymentSnapshotModel, plain);
  }
}
