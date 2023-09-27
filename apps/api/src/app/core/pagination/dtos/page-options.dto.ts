import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min, ValidateIf } from 'class-validator';

import { PaginationQueryParamsInterface } from '@financial-project/common';

export class PageOptionsDto implements PaginationQueryParamsInterface {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  pageIndex: number;

  @Type(() => Number)
  @IsNumber()
  @ValidateIf((o) => Boolean(o.pageIndex))
  @Min(1)
  @Max(100)
  pageSize: number;
}
