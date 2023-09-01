import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonobankModule } from '@financial-project/common';

import { AccountsModule } from '../accounts/accounts.module';
import { ProviderEntity } from './entities/provider.entity';
import { ProvidersController } from './providers.controller';
import { ProviderFactoryService } from './services/provider-factory.service';
import { ProvidersService } from './services/providers.service';

@Module({
  controllers: [ProvidersController],
  providers: [ProvidersService, ProviderFactoryService],
  imports: [TypeOrmModule.forFeature([ProviderEntity]), MonobankModule, AccountsModule],
  exports: [ProvidersService],
})
export class ProvidersModule {}
