import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiPathEnum } from '@financial-project/common';

import { UserEntity } from '../users/entities/user.entity';
import { AuthenticationService } from './authentication.service';
import { LogInDto } from './dto/log-in.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtTokensModel } from './models/jwt-tokens.model';

@Controller(ApiPathEnum.Authentication)
@ApiTags('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post(ApiPathEnum.SignIn)
  @ApiResponse({
    status: 201,
    description: 'The user\'s JWT tokens',
    type: JwtTokensModel,
  })
  logIn(@Body() lobInData: LogInDto): Promise<JwtTokensModel> {
    return this.authenticationService.logIn(lobInData);
  }

  @Post(ApiPathEnum.Register)
  @ApiResponse({
    status: 200,
    description: 'The user entity object',
    type: UserEntity,
  })
  async register(@Body() registerData: RegisterDto): Promise<UserEntity> {
    return this.authenticationService.register(registerData);
  }
}
