import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty } from 'class-validator';

export class GetSummaryDto {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  fromDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  toDate: Date;

  @IsArray()
  @IsNotEmpty()
  accountIds: string[];
}
