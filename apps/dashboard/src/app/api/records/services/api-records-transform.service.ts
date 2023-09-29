import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';

import { PaginatedResponseInterface, RecordInterface } from '@financial-project/common';

import { PaginatedResponse } from '../../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../../core/pagination/interfaces/pagination-params.interface';
import { toPaginationQueryParams } from '../../../core/pagination/utils/pagination-utils';
import { RecordModel } from '../models/record.model';
import { UpdateRecordDataType } from '../types/api-records.types';

@Injectable({
  providedIn: 'root',
})
export class ApiRecordsTransformService {
  toExtractRecordsParams(pagination?: PaginationParamsInterface) {
    return new HttpParams({
      fromObject: toPaginationQueryParams(pagination),
    });
  }

  fromExtractRecords(response: PaginatedResponseInterface<RecordInterface>): PaginatedResponse<RecordModel> {
    return new PaginatedResponse<RecordModel>(
      response.data.map((d) => this.toRecordModel(d)),
      response.meta
    );
  }

  toUpdateRecord({ name, comment, category }: RecordModel): UpdateRecordDataType {
    return {
      name,
      comment,
      categoryId: category?.id,
    };
  }

  fromUpdateRecord(response: RecordInterface): RecordModel {
    return this.toRecordModel(response);
  }

  private toRecordModel(plain: RecordInterface): RecordModel {
    return plainToInstance(RecordModel, plain);
  }
}
