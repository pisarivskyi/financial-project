import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  accountId: string;

  @IsOptional()
  // @IsString()
  @Type(() => Date)
  fromDate?: Date;

  @IsOptional()
  // @IsString()
  @Type(() => Date)
  toDate?: Date;
}
