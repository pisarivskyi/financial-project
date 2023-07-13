import { Injectable } from '@angular/core';
import { PostgrestResponse } from '@supabase/supabase-js';
import { Observable } from 'rxjs';

import { ExpanseCategory } from '../../api/expanse-categories/models/expanse-category.model';
import { ApiExpanseCategoriesService } from '../../api/expanse-categories/services/api-expanse-categories.service';

@Injectable({
  providedIn: 'root',
})
export class ExpanseCategoriesService {
  constructor(private apiExpanseCategoriesService: ApiExpanseCategoriesService) {}

  getExpanseCategories(): Observable<PostgrestResponse<ExpanseCategory>> {
    return this.apiExpanseCategoriesService.fetchExpanseCategories();
  }
}
