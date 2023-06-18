import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostgrestResponse } from '@supabase/supabase-js';

import { ApiExpanseCategoriesService } from '../../api/expanse-categories/services/api-expanse-categories.service';
import { ExpanseCategory } from '../../api/expanse-categories/models/expanse-category.model';

@Injectable({
  providedIn: 'root'
})
export class ExpanseCategoriesService {
  constructor(private apiExpanseCategoriesService: ApiExpanseCategoriesService) { }

  getExpanseCategories(): Observable<PostgrestResponse<ExpanseCategory>> {
    return this.apiExpanseCategoriesService.fetchExpanseCategories();
  }
}
