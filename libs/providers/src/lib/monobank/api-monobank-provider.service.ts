import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

import { ApiMonobank } from './api-monobank.interface';

@Injectable()
export class ApiMonobankProviderService {
  private readonly baseUrl = 'https://api.monobank.ua/personal';

  constructor(private readonly httpService: HttpService) {}

  getClientInfo$(token: string): Observable<AxiosResponse<ApiMonobank.ClientInfo.ResponseInterface>> {
    return this.httpService.get(`${this.baseUrl}/client-info`, {
      headers: {
        'X-Token': token,
      },
    });
  }

  getStatement$(
    token: string,
    accountId: string,
    fromDate: DateTime,
    toDate: DateTime
  ): Observable<AxiosResponse<ApiMonobank.Statement.ResponseType>> {
    return this.httpService.get(
      `${this.baseUrl}/statement/${accountId}/${fromDate.toUnixInteger()}/${toDate.toUnixInteger()}`,
      {
        headers: {
          'X-Token': token,
        },
      }
    );
  }
}
