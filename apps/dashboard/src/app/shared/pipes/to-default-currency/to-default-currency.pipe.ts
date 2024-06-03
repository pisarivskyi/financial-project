import { LOCALE_ID, Pipe, PipeTransform, inject } from '@angular/core';

import { CurrencyEnum } from '@financial-project/common';

import { CurrencyRateModel } from '../../../api/currency-rates/models/currency-rate.model';
import { CurrencyRatesService } from '../../../dashboard/services/currency-rates.service';
import { SettingsService } from '../../../dashboard/services/settings.service';
import { AmountFormatPipe } from '../amount-format/amount-format.pipe';
import { CurrencyFormatPipe } from '../currency-format/currency-format.pipe';

@Pipe({
  name: 'toDefaultCurrency',
  standalone: true,
})
export class ToDefaultCurrencyPipe implements PipeTransform {
  settingsService = inject(SettingsService);
  currencyRatesService = inject(CurrencyRatesService);
  locale = inject(LOCALE_ID);
  amountFormatPipe = new AmountFormatPipe(this.locale);
  currencyFormatPipe = new CurrencyFormatPipe();

  transform(amount: number, currency: CurrencyEnum, currencyRates?: CurrencyRateModel[]): string | number {
    const { defaultCurrencyCode } = this.settingsService.getSettingsSync();

    if (defaultCurrencyCode === currency) {
      return this.currencyFormatPipe.transform(this.amountFormatPipe.transform(amount), defaultCurrencyCode);
    } else if (currencyRates && currencyRates?.length) {
      return this.currencyFormatPipe.transform(
        this.amountFormatPipe.transform(
          this.currencyRatesService.convert(amount, currency, defaultCurrencyCode, currencyRates),
        ),
        defaultCurrencyCode,
      );
    } else {
      return this.currencyFormatPipe.transform(
        this.amountFormatPipe.transform(this.currencyRatesService.convert(amount, currency, defaultCurrencyCode)),
        defaultCurrencyCode,
      );
    }
  }
}
