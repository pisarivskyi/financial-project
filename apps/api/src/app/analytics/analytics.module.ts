import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountEntity } from '../accounts/entities/account.entity';
import { RecordEntity } from '../records/entities/record.entity';
import { SettingsEntity } from '../settings/entities/settings.entity';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  imports: [TypeOrmModule.forFeature([RecordEntity, SettingsEntity, AccountEntity])],
})
export class AnalyticsModule {}
