import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ConfigurationService } from '../../configuration/services/configuration.service';
import { HttpRequestParamsInterface } from '../interfaces/http-request-params.interface';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  httpClient = inject(HttpClient);
  configurationService = inject(ConfigurationService);

  makeRequest<T>(requestParams: HttpRequestParamsInterface): Observable<T> {
    return this.httpClient.request<T>(requestParams.method, this.prepareUrl(requestParams.path), {
      body: requestParams.payload,
      params: requestParams.params,
    });
  }

  private prepareUrl(path: string): string {
    return `${this.configurationService.getHost()}/api${path}`;
  }
}
