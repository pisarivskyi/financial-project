import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Trim } from 'class-sanitizer';

export class LogInDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @Trim()
  @IsNotEmpty()
  @IsString()
  password: string;
}
