import { PaginationInterface } from '../interfaces/pagination.interface';

export class PaginationModel implements PaginationInterface {
  pageIndex: number;
  pageSize: number;
  total: number;

  constructor(data: Record<string, number>) {
    this.pageIndex = data['pageIndex'];
    this.pageSize = data['pageSize'];
    this.total = data['total'];
  }

  patch(data: Partial<PaginationInterface>): PaginationModel {
    this.pageIndex = data.pageIndex ?? this.pageIndex;
    this.pageSize = data.pageSize ?? this.pageSize;
    this.total = data.total ?? this.total;

    return this;
  }
}
