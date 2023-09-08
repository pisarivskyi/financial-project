import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';

@Module({
  controllers: [],
  providers: [JwtAccessTokenStrategy],
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  exports: [PassportModule],
})
export class AuthenticationModule {}
