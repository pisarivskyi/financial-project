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
    skip: (pagination.page - 1) * pagination.size,
    take: pagination.size,
  });

  return new PageDto(items, {
    pageSize: pagination.size,
    pageIndex: pagination.page,
    total: count,
  });
}
