import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'nest-keycloak-connect';

import { ApiPathEnum } from '@financial-project/common';
import { ApiMonobank } from '@financial-project/providers';

import { CurrencyRatesService } from './currency-rates.service';

@Controller(ApiPathEnum.CurrencyRates)
export class CurrencyRatesController {
  constructor(private readonly currenciesService: CurrencyRatesService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(): Promise<ApiMonobank.Currencies.ResponseType> {
    return this.currenciesService.getCurrencies();
  }
}
