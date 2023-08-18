import { Trim } from 'class-sanitizer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
