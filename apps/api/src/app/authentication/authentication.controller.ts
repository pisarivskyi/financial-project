import { Body, Controller, Post } from '@nestjs/common';

import { AuthenticationService } from './authentication.service';
import { LogInDto } from './dto/log-in.dto';
import { RegisterDto } from './dto/register.dto';
import { UserEntity } from '../users/entities/user.entity';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-in')
  logIn(@Body() lobInData: LogInDto): Promise<any> {
    return this.authenticationService.logIn(lobInData);
  }

  @Post('register')
  async register(@Body() registerData: RegisterDto): Promise<UserEntity> {
    return this.authenticationService.register(registerData);
  }
}
