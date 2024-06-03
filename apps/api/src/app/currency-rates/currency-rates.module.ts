import { Module } from '@nestjs/common';

import { MonobankModule } from '@financial-project/providers';

import { AuthenticationModule } from '../authentication/authentication.module';
import { CurrencyRatesController } from './currency-rates.controller';
import { CurrencyRatesService } from './currency-rates.service';

@Module({
  controllers: [CurrencyRatesController],
  providers: [CurrencyRatesService],
  imports: [MonobankModule, AuthenticationModule],
})
export class CurrencyRatesModule {}
