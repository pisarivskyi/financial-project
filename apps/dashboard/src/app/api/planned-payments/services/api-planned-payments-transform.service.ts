import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';

import { PaginatedResponseInterface, PeriodEnum, PlannedPaymentInterface } from '@financial-project/common';

import { PaginatedResponse } from '../../../core/pagination/classes/paginated-response.class';
import { PaginationParamsInterface } from '../../../core/pagination/interfaces/pagination-params.interface';
import { toPaginationQueryParams } from '../../../core/pagination/utils/pagination-utils';
import { PlannedPaymentModel } from '../models/planned-payment.model';
import { InsertPlannedPaymentDataType, UpdatePlannedPaymentDataType } from '../types/api-planned-payment.types';

@Injectable({
  providedIn: 'root',
})
export class ApiPlannedPaymentsTransformService {
  fromExtractPlannedPayments(
    response: PaginatedResponseInterface<PlannedPaymentInterface>,
  ): PaginatedResponse<PlannedPaymentModel> {
    return new PaginatedResponse<PlannedPaymentModel>(
      response.data.map((d) => this.toPlannedPaymentModel(d)),
      response.meta,
    );
  }

  toExtractPlannedPaymentsParams(pagination?: PaginationParamsInterface) {
    return new HttpParams({
      fromObject: toPaginationQueryParams(pagination),
    });
  }

  fromInsertPlannedPayment(response: PlannedPaymentInterface): PlannedPaymentModel {
    return this.toPlannedPaymentModel(response);
  }

  toInsertPlannedPayment({
    name,
    color,
    amount,
    period,
    currencyCode,
    category,
    type,
    dateOfYear,
    dayOfMonth,
    dayOfWeek,
  }: PlannedPaymentModel): InsertPlannedPaymentDataType {
    return {
      amount,
      currencyCode: currencyCode,
      period,
      name,
      color,
      categoryId: category.id,
      type,
      ...(period === PeriodEnum.OneTime || period === PeriodEnum.Yearly ? { dateOfYear } : {}),
      ...(period === PeriodEnum.Monthly ? { dayOfMonth } : {}),
      ...(period === PeriodEnum.Weekly ? { dayOfWeek } : {}),
    };
  }

  toUpdatePlannedPayment({
    name,
    color,
    amount,
    period,
    currencyCode,
    category,
    type,
    dateOfYear,
    dayOfMonth,
    dayOfWeek,
  }: PlannedPaymentModel): UpdatePlannedPaymentDataType {
    return {
      amount,
      currencyCode: currencyCode,
      period,
      name,
      color,
      categoryId: category.id,
      type,
      ...(period === PeriodEnum.OneTime || period === PeriodEnum.Yearly ? { dateOfYear } : {}),
      ...(period === PeriodEnum.Monthly ? { dayOfMonth } : {}),
      ...(period === PeriodEnum.Weekly ? { dayOfWeek } : {}),
    };
  }

  fromUpdatePlannedPayment(response: PlannedPaymentInterface): PlannedPaymentModel {
    return this.toPlannedPaymentModel(response);
  }

  fromDeletePlannedPayment(response: PlannedPaymentInterface): PlannedPaymentModel {
    return this.toPlannedPaymentModel(response);
  }

  private toPlannedPaymentModel(plain: PlannedPaymentInterface): PlannedPaymentModel {
    return plainToInstance(PlannedPaymentModel, plain);
  }
}
