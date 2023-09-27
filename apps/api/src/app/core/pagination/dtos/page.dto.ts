import { PaginatedResponseInterface, PaginatedResponseMetaInterface } from '@financial-project/common';

import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> implements PaginatedResponseInterface<T> {
  readonly data: T[];
  readonly meta: PageMetaDto;

  constructor(data: T[], params: PaginatedResponseMetaInterface) {
    this.meta = new PageMetaDto(params);
    this.data = data;
  }
}
