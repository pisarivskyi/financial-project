import { IsOptional, IsString } from 'class-validator';

export class UpdateRecordDto {
  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;
}
