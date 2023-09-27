import { EmptyConfig, PropsFactory, Reducer, StateOf } from '@ngneat/elf';

import { PaginatedResponseMetaInterface, PaginationQueryParamsInterface } from '@financial-project/common';

import { PaginationParamsInterface } from '../interfaces/pagination-params.interface';

export function toPaginationQueryParams(data: PaginationParamsInterface | undefined | null): Record<string, any> {
  if (!data) {
    return {};
  }

  return {
    pageIndex: data.pageIndex,
    pageSize: data.pageSize,
  } as PaginationQueryParamsInterface;
}

export interface PaginationState {
  pagination: PaginatedResponseMetaInterface;
}

export function withPaginationData(
  initialPaginationData: PaginatedResponseMetaInterface = {
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  }
): PropsFactory<PaginationState, EmptyConfig> {
  return {
    props: {
      pagination: {
        ...initialPaginationData,
      },
    },
    config: undefined,
  };
}

export function updatePaginationData<S extends StateOf<typeof withPaginationData>>(
  data: Partial<S['pagination']>
): Reducer<S> {
  return function (state: S) {
    return {
      ...state,
      pagination: {
        pageSize: data.pageSize ?? state.pagination.pageSize,
        pageIndex: data.pageIndex ?? state.pagination.pageIndex,
        total: data.total ?? state.pagination.total,
      },
    };
  };
}
