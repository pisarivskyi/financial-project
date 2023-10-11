import { ApiProperty } from '@nestjs/swagger';
import { Trim } from 'class-sanitizer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
