import { PageMetaDto } from './page-meta.dto';
import { PageMetaDtoParametersInterface } from '../interfaces/page-meta-dto-parameters.interface';

export class PageDto<T> {
  readonly data: T[];
  readonly meta: PageMetaDto;

  constructor(data: T[], params: PageMetaDtoParametersInterface) {
    this.meta = new PageMetaDto(params);
    this.data = data;
  }
}
