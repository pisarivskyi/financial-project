import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { PaginatedResponseInterface, PlannedPaymentInterface } from '@financial-project/common';

import { HttpMethodEnum } from '../../../core/communication/enums/http-method.enum';
import { CommunicationService } from '../../../core/communication/services/communication.service';
import { PaginatedResponse } from '../../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../../core/pagination/interfaces/pagination-params.interface';
import { PlannedPaymentModel } from '../models/planned-payment.model';
import { ApiPlannedPaymentsTransformService } from './api-planned-payments-transform.service';

@Injectable({
  providedIn: 'root',
})
export class ApiPlannedPaymentsService {
  readonly requests = {
    plannedPayments: '/planned-payments',
    updatePlannedPayments: (id: string) => `/planned-payments/${id}`,
    deletePlannedPayments: (id: string) => `/planned-payments/${id}`,
  };

  constructor(
    private apiPlannedPaymentsTransformService: ApiPlannedPaymentsTransformService,
    private communicationService: CommunicationService,
  ) {}

  extractPlannedPayments$(pagination?: PaginationParamsInterface): Observable<PaginatedResponse<PlannedPaymentModel>> {
    return this.communicationService
      .makeRequest<PaginatedResponseInterface<PlannedPaymentInterface>>({
        method: HttpMethodEnum.Get,
        path: this.requests.plannedPayments,
        params: this.apiPlannedPaymentsTransformService.toExtractPlannedPaymentsParams(pagination),
      })
      .pipe(map((response) => this.apiPlannedPaymentsTransformService.fromExtractPlannedPayments(response)));
  }

  insertPlannedPayment$(plannedPaymentToSave: PlannedPaymentModel): Observable<PlannedPaymentModel> {
    return this.communicationService
      .makeRequest<PlannedPaymentInterface>({
        method: HttpMethodEnum.Post,
        path: this.requests.plannedPayments,
        payload: this.apiPlannedPaymentsTransformService.toInsertPlannedPayment(plannedPaymentToSave),
      })
      .pipe(map((response) => this.apiPlannedPaymentsTransformService.fromInsertPlannedPayment(response)));
  }

  updatePlannedPayment$(plannedPaymentToUpdate: PlannedPaymentModel): Observable<PlannedPaymentModel> {
    return this.communicationService
      .makeRequest<PlannedPaymentInterface>({
        method: HttpMethodEnum.Patch,
        path: this.requests.updatePlannedPayments(plannedPaymentToUpdate.id),
        payload: this.apiPlannedPaymentsTransformService.toUpdatePlannedPayment(plannedPaymentToUpdate),
      })
      .pipe(map((response) => this.apiPlannedPaymentsTransformService.fromUpdatePlannedPayment(response)));
  }

  deletePlannedPayment$(id: string): Observable<PlannedPaymentModel> {
    return this.communicationService
      .makeRequest<PlannedPaymentInterface>({
        method: HttpMethodEnum.Delete,
        path: this.requests.deletePlannedPayments(id),
      })
      .pipe(map((response) => this.apiPlannedPaymentsTransformService.fromDeletePlannedPayment(response)));
  }
}
