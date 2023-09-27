import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { CategoryInterface, PaginatedResponseInterface } from '@financial-project/common';

import { HttpMethodEnum } from '../../../core/communication/enums/http-method.enum';
import { CommunicationService } from '../../../core/communication/services/communication.service';
import { PaginatedResponse } from '../../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../../core/pagination/interfaces/pagination-params.interface';
import { CategoryModel } from '../models/category.model';
import { ApiCategoriesTransformService } from './api-categories-transform.service';

@Injectable({
  providedIn: 'root',
})
export class ApiCategoriesService {
  readonly requests = {
    categories: '/categories',
  };

  constructor(
    private apiCategoriesTransformService: ApiCategoriesTransformService,
    private communicationService: CommunicationService
  ) {}

  extractCategories$(pagination?: PaginationParamsInterface): Observable<PaginatedResponse<CategoryModel>> {
    return this.communicationService
      .makeRequest<PaginatedResponseInterface<CategoryInterface>>({
        method: HttpMethodEnum.Get,
        path: this.requests.categories,
        params: this.apiCategoriesTransformService.toExtractCategoriesParams(pagination),
      })
      .pipe(map((response) => this.apiCategoriesTransformService.fromExtractCategories(response)));
  }

  insertCategory$(categoryToSave: CategoryModel): Observable<CategoryModel> {
    return this.communicationService
      .makeRequest<CategoryInterface>({
        method: HttpMethodEnum.Post,
        path: this.requests.categories,
        payload: this.apiCategoriesTransformService.toInsertCategory(categoryToSave),
      })
      .pipe(map((response) => this.apiCategoriesTransformService.fromInsertCategory(response)));
  }

  updateCategory$(categoryToUpdate: CategoryModel): Observable<CategoryModel> {
    return this.communicationService
      .makeRequest<CategoryInterface>({
        method: HttpMethodEnum.Patch,
        path: `${this.requests.categories}/${categoryToUpdate.id}`,
        payload: this.apiCategoriesTransformService.toUpdateCategory(categoryToUpdate),
      })
      .pipe(map((response) => this.apiCategoriesTransformService.fromUpdateCategory(response)));
  }

  deleteCategory$(id: string): Observable<CategoryModel> {
    return this.communicationService
      .makeRequest<CategoryInterface>({
        method: HttpMethodEnum.Patch,
        path: `${this.requests.categories}/${id}`,
      })
      .pipe(map((response) => this.apiCategoriesTransformService.fromDeleteCategory(response)));
  }
}
