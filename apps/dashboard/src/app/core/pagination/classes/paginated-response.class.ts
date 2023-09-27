import { PaginatedResponseInterface, PaginatedResponseMetaInterface } from '@financial-project/common';

import { PaginatedResponseMeta } from './paginated-response-meta.dto';

export class PaginatedResponse<T> implements PaginatedResponseInterface<T> {
  data: T[];
  meta: PaginatedResponseMeta;

  constructor(data: T[], meta: PaginatedResponseMetaInterface) {
    this.data = data;
    this.meta = new PaginatedResponseMeta(meta);
  }
}
