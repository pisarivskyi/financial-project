import { IsArray, IsNotEmpty } from 'class-validator';

export class SaveAccountsDto {
  @IsNotEmpty()
  @IsArray()
  accountIds: string[];
}
