import { FindManyOptions, Repository } from 'typeorm';

import { PageOptionsDto } from '../dtos/page-options.dto';
import { PageDto } from '../dtos/page.dto';

export async function paginate<T>(
  repository: Repository<T>,
  pagination: PageOptionsDto,
  options: FindManyOptions<T> = {}
): Promise<PageDto<T>> {
  const [items, count] = await repository.findAndCount({
    ...options,
    ...(pagination.pageIndex
      ? {
          skip: (pagination.pageIndex - 1) * pagination.pageSize,
          take: pagination.pageSize,
        }
      : {}),
  });

  return new PageDto(items, {
    pageSize: pagination.pageSize,
    pageIndex: pagination.pageIndex,
    total: count,
  });
}
