import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtAccessTokenStrategy],
  imports: [UsersModule, JwtModule.register({ signOptions: { expiresIn: '3d' } })],
})
export class AuthenticationModule {}
