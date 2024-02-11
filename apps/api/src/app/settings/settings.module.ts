import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationModule } from '../authentication/authentication.module';
import { SettingsEntity } from './entities/settings.entity';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
  imports: [TypeOrmModule.forFeature([SettingsEntity]), AuthenticationModule],
})
export class SettingsModule {}
