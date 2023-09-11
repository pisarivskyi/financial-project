import { PageMetaDtoParametersInterface } from '../interfaces/page-meta-dto-parameters.interface';

export class PageMetaDto {
  readonly pageIndex: number;
  readonly pageSize: number;
  readonly total: number;

  constructor(params: PageMetaDtoParametersInterface) {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.total = params.total;
  }
}
