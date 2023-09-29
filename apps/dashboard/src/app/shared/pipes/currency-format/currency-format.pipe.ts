import { Pipe, PipeTransform } from '@angular/core';

import { CurrencyEnum } from '@financial-project/common';

import { CurrencySymbolsConst } from '../../enums/currency-symbols.const';

@Pipe({
  name: 'currencyFormat',
  standalone: true,
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(rawAmount: string | number, currency: CurrencyEnum): string {
    switch (currency) {
      case CurrencyEnum.UAH: {
        return this.formatUAH(rawAmount);
      }

      case CurrencyEnum.EUR: {
        return this.formatEUR(rawAmount);
      }

      case CurrencyEnum.USD: {
        return this.formatUSD(rawAmount);
      }

      default: {
        return rawAmount.toString();
      }
    }
  }

  private formatUAH(amount: string | number): string {
    return `${CurrencySymbolsConst[CurrencyEnum.UAH]} ${amount}`;
  }

  private formatEUR(amount: string | number): string {
    return `${CurrencySymbolsConst[CurrencyEnum.EUR]} ${amount}`;
  }

  private formatUSD(amount: string | number): string {
    return `${CurrencySymbolsConst[CurrencyEnum.USD]} ${amount}`;
  }
}
