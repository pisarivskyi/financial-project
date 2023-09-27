import { PaginatedResponseMetaInterface } from './paginated-response-meta.interface';

export interface PaginatedResponseInterface<T> {
  data: T[];
  meta: PaginatedResponseMetaInterface;
}
