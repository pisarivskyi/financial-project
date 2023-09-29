import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RecordModel } from '../../api/records/models/record.model';
import { ApiRecordsService } from '../../api/records/services/api-records.service';
import { PaginatedResponse } from '../../core/pagination/classes/paginated-response.class';
import { PaginationInterface } from '../../core/supabase/interfaces/pagination.interface';

@Injectable({
  providedIn: 'root',
})
export class RecordsService {
  constructor(private apiRecordsService: ApiRecordsService) {}

  getRecords$(pagination?: PaginationInterface): Observable<PaginatedResponse<RecordModel>> {
    return this.apiRecordsService.extractRecords$(pagination);
  }

  updateRecord$(recordToUpdate: RecordModel): Observable<RecordModel> {
    return this.apiRecordsService.updateRecord$(recordToUpdate);
  }
}
