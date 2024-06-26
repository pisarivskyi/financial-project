import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PlannedPaymentModel } from '../../api/planned-payments/models/planned-payment.model';
import { ApiPlannedPaymentsService } from '../../api/planned-payments/services/api-planned-payments.service';
import { PaginatedResponse } from '../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../core/pagination/interfaces/pagination-params.interface';

@Injectable({
  providedIn: 'root',
})
export class PlannedPaymentsService {
  private apiPlannedPaymentsService = inject(ApiPlannedPaymentsService);

  getPlannedPayments$(pagination?: PaginationParamsInterface): Observable<PaginatedResponse<PlannedPaymentModel>> {
    return this.apiPlannedPaymentsService.extractPlannedPayments$(pagination);
  }

  savePlannedPayment$(plannedPaymentToSave: PlannedPaymentModel): Observable<PlannedPaymentModel> {
    return this.apiPlannedPaymentsService.insertPlannedPayment$(plannedPaymentToSave);
  }

  deletePlannedPayment$(id: string): Observable<PlannedPaymentModel> {
    return this.apiPlannedPaymentsService.deletePlannedPayment$(id);
  }

  updatePlannedPayment$(plannedPaymentToUpdate: PlannedPaymentModel): Observable<PlannedPaymentModel> {
    return this.apiPlannedPaymentsService.updatePlannedPayment$(plannedPaymentToUpdate);
  }
}
