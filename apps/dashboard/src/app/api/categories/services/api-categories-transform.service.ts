import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';

import { CategoryInterface, PaginatedResponseInterface } from '@financial-project/common';

import { PaginatedResponse } from '../../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../../core/pagination/interfaces/pagination-params.interface';
import { toPaginationQueryParams } from '../../../core/pagination/utils/pagination-utils';
import { CategoryModel } from '../models/category.model';
import { InsertCategoryDataType, UpdateCategoryDataType } from '../types/api-categories.types';

@Injectable({
  providedIn: 'root',
})
export class ApiCategoriesTransformService {
  fromExtractCategories(response: PaginatedResponseInterface<CategoryInterface>): PaginatedResponse<CategoryModel> {
    return new PaginatedResponse<CategoryModel>(
      response.data.map((d) => this.toCategoryModel(d)),
      response.meta
    );
  }

  toExtractCategoriesParams(pagination?: PaginationParamsInterface) {
    return new HttpParams({
      fromObject: toPaginationQueryParams(pagination),
    });
  }

  fromInsertCategory(response: CategoryInterface): CategoryModel {
    return this.toCategoryModel(response);
  }

  toInsertCategory({ name, color, icon, parentCategory }: CategoryModel): InsertCategoryDataType {
    return {
      name,
      color,
      icon,
      parentCategory: parentCategory.id,
    };
  }

  toUpdateCategory({ name, color, icon, parentCategory }: CategoryModel): UpdateCategoryDataType {
    return {
      name,
      color,
      icon,
      parentCategory: parentCategory?.id,
    };
  }

  fromUpdateCategory(response: CategoryInterface): CategoryModel {
    return this.toCategoryModel(response);
  }

  fromDeleteCategory(response: CategoryInterface): CategoryModel {
    return this.toCategoryModel(response);
  }

  private toCategoryModel(plain: CategoryInterface): CategoryModel {
    return plainToInstance(CategoryModel, plain);
  }
}
