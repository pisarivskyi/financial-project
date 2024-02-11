import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, KeycloakConnectModule } from 'nest-keycloak-connect';

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  imports: [
    KeycloakConnectModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        authServerUrl: configService.get('KEYCLOAK_SERVER_URL'),
        realm: configService.get('KEYCLOAK_REALM'),
        clientId: configService.get('KEYCLOAK_CLIENT_ID'),
        secret: configService.get('KEYCLOAK_SECRET'),
        useNestLogger: configService.get('KEYCLOAK_USE_NEST_LOGGER'),
      }),
    }),
  ],
  exports: [KeycloakConnectModule],
})
export class AuthenticationModule {}
