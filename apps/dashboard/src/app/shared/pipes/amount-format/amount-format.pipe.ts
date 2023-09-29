import { DecimalPipe } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

import { CurrencyEnum } from '@financial-project/common';

@Pipe({
  name: 'amountFormat',
  standalone: true,
})
export class AmountFormatPipe implements PipeTransform {
  private decimalPipe: DecimalPipe;

  constructor(@Inject(LOCALE_ID) locale: string) {
    this.decimalPipe = new DecimalPipe(locale);
  }

  transform(amount: number, currency?: CurrencyEnum): string {
    switch (currency) {
      default: {
        return this.formatDefault(amount);
      }
    }
  }

  private formatDefault(amount: number): string {
    return this.decimalPipe.transform(amount / 100) ?? '';
  }
}
