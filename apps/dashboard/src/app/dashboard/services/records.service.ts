import { Injectable } from '@angular/core';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import { Observable } from 'rxjs';

import { RecordModel } from '../../api/records/models/record.model';
import { ApiRecordsService } from '../../api/records/services/api-records.service';
import { PaginationInterface } from '../../core/supabase/interfaces/pagination.interface';
import { ApiInsertRecordRowData, ApiUpdateRecordRowData } from '../../core/supabase/types/table.types';
import { UUID } from '../../core/supabase/types/uuid.type';

@Injectable({
  providedIn: 'root',
})
export class RecordsService {
  constructor(private apiRecordsService: ApiRecordsService) {}

  getRecords$(pagination?: PaginationInterface): Observable<PostgrestResponse<RecordModel>> {
    return this.apiRecordsService.fetchRecords$(pagination);
  }

  saveRecord$(recordData: ApiInsertRecordRowData): Observable<PostgrestResponse<RecordModel>> {
    return this.apiRecordsService.insertRecord$(recordData);
  }

  deleteRecord$(id: UUID): Observable<PostgrestSingleResponse<null>> {
    return this.apiRecordsService.deleteRecord$(id);
  }

  updateRecord$(id: UUID, recordData: ApiUpdateRecordRowData): Observable<PostgrestSingleResponse<null>> {
    return this.apiRecordsService.updateRecord$(id, recordData);
  }
}
