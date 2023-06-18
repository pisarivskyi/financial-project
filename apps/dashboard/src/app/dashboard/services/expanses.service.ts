import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';

import { ApiExpansesService } from '../../api/expanses/services/api-expanses.service';
import { ExpanseModel } from '../../api/expanses/models/expanse.model';
import { ApiInsertExpanseRowData, ApiUpdateExpanseRowData } from '../../core/supabase/types/table.types';
import { UUID } from '../../core/supabase/types/uuid.type';

@Injectable({
  providedIn: 'root'
})
export class ExpansesService {
  constructor(private apiExpansesService: ApiExpansesService) { }

  getExpanses(): Observable<PostgrestResponse<ExpanseModel>> {
    return this.apiExpansesService.fetchExpanses();
  }

  saveExpanse(expanse: ApiInsertExpanseRowData): Observable<PostgrestResponse<ExpanseModel>> {
    return this.apiExpansesService.insertExpanse(expanse);
  }

  deleteExpanse(id: UUID): Observable<PostgrestSingleResponse<null>> {
    return this.apiExpansesService.deleteExpanse(id);
  }

  updateExpanse(id: UUID, expanseData: ApiUpdateExpanseRowData): Observable<PostgrestSingleResponse<null>> {
    return this.apiExpansesService.updateExpanse(id, expanseData);
  }
}
