import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountsModule } from './accounts/accounts.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { BudgetPlansModule } from './budget-plans/budget-plans.module';
import { BudgetSnapshotsModule } from './budget-snapshots/budget-snapshots.module';
import { BudgetsModule } from './budgets/budgets.module';
import { CategoriesModule } from './categories/categories.module';
import typeorm from './configs/typeorm.config';
import { CurrencyRatesModule } from './currency-rates/currency-rates.module';
import { JobsModule } from './jobs/jobs.module';
import { MerchantCategoryCodesModule } from './merchant-category-codes/merchant-category-codes.module';
import { PlannedPaymentSnapshotsModule } from './planned-payment-snapshots/planned-payment-snapshots.module';
import { PlannedPaymentsModule } from './planned-payments/planned-payments.module';
import { ProvidersModule } from './providers/providers.module';
import { RecordsModule } from './records/records.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [typeorm] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => configService.get('typeorm'),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    AuthenticationModule,
    AccountsModule,
    BudgetsModule,
    CategoriesModule,
    RecordsModule,
    SettingsModule,
    ProvidersModule,
    JobsModule,
    AnalyticsModule,
    MerchantCategoryCodesModule,
    PlannedPaymentsModule,
    PlannedPaymentSnapshotsModule,
    BudgetSnapshotsModule,
    BudgetPlansModule,
    CurrencyRatesModule,
  ],
})
export class AppModule {}
