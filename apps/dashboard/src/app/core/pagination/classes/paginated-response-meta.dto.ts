import { PaginatedResponseMetaInterface } from '@financial-project/common';

export class PaginatedResponseMeta implements PaginatedResponseMetaInterface {
  readonly pageIndex: number;
  readonly pageSize: number;
  readonly total: number;

  constructor(params: PaginatedResponseMetaInterface) {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.total = params.total;
  }
}
