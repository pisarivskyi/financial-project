import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { ApiProperty } from '@nestjs/swagger';

export class LogInDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @Trim()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}
