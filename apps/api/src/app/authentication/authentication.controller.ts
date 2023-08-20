import { Body, Controller, Post } from '@nestjs/common';

import { ApiPathEnum } from '@financial-project/common';

import { UserEntity } from '../users/entities/user.entity';
import { AuthenticationService } from './authentication.service';
import { LogInDto } from './dto/log-in.dto';
import { RegisterDto } from './dto/register.dto';

@Controller(ApiPathEnum.Authentication)
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post(ApiPathEnum.SignIn)
  logIn(@Body() lobInData: LogInDto): Promise<any> {
    return this.authenticationService.logIn(lobInData);
  }

  @Post(ApiPathEnum.Register)
  async register(@Body() registerData: RegisterDto): Promise<UserEntity> {
    return this.authenticationService.register(registerData);
  }
}
