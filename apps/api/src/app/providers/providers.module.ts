import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonobankModule } from '@financial-project/providers';

import { AccountsModule } from '../accounts/accounts.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { ProviderEntity } from './entities/provider.entity';
import { ProvidersController } from './providers.controller';
import { IssuerService } from './services/issuer.service';
import { ProviderFactoryService } from './services/provider-factory.service';
import { ProvidersService } from './services/providers.service';

@Module({
  controllers: [ProvidersController],
  providers: [ProvidersService, ProviderFactoryService, IssuerService],
  imports: [TypeOrmModule.forFeature([ProviderEntity]), MonobankModule, AccountsModule, AuthenticationModule],
  exports: [ProvidersService],
})
export class ProvidersModule {}
