import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { PaginatedResponseInterface, RecordInterface } from '@financial-project/common';

import { HttpMethodEnum } from '../../../core/communication/enums/http-method.enum';
import { CommunicationService } from '../../../core/communication/services/communication.service';
import { PaginatedResponse } from '../../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../../core/pagination/interfaces/pagination-params.interface';
import { RecordModel } from '../models/record.model';
import { ApiRecordsTransformService } from './api-records-transform.service';

@Injectable({
  providedIn: 'root',
})
export class ApiRecordsService {
  readonly requests = {
    records: '/records',
  };

  constructor(
    private apiRecordsTransformService: ApiRecordsTransformService,
    private communicationService: CommunicationService
  ) {}

  extractRecords$(pagination?: PaginationParamsInterface): Observable<PaginatedResponse<RecordModel>> {
    return this.communicationService
      .makeRequest<PaginatedResponseInterface<RecordInterface>>({
        method: HttpMethodEnum.Get,
        path: this.requests.records,
        params: this.apiRecordsTransformService.toExtractRecordsParams(pagination),
      })
      .pipe(map((response) => this.apiRecordsTransformService.fromExtractRecords(response)));
  }

  updateRecord$(recordToUpdate: RecordModel): Observable<RecordModel> {
    return this.communicationService
      .makeRequest<RecordInterface>({
        method: HttpMethodEnum.Patch,
        path: `${this.requests.records}/${recordToUpdate.id}`,
        payload: this.apiRecordsTransformService.toUpdateRecord(recordToUpdate),
      })
      .pipe(map((response) => this.apiRecordsTransformService.fromUpdateRecord(response)));
  }
}
