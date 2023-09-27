import { HttpParams } from '@angular/common/http';

import { HttpMethodEnum } from '../enums/http-method.enum';

export interface HttpRequestParamsInterface {
  method: HttpMethodEnum;
  path: string;
  payload?: any;
  params?: HttpParams;
}
