import { Injectable } from '@nestjs/common';

import { IssuerEnum } from '@financial-project/common';

@Injectable()
export class IssuerService {
  getIssuer(cardNumber: string): IssuerEnum {
    if (this.isMasterCard(cardNumber)) {
      return IssuerEnum.MasterCard;
    } else if (this.isVisa(cardNumber)) {
      return IssuerEnum.Visa;
    } else if (this.isAmericanExpress(cardNumber)) {
      return IssuerEnum.AmericanExpress;
    } else if (this.isMaestro(cardNumber)) {
      return IssuerEnum.Maestro;
    }

    return IssuerEnum.Unknown;
  }

  // Credit Card Number (Mastercard) is a 16-digit number beginning with 51–55 or 2221–2720
  private isMasterCard(cardNumber: string): boolean {
    const number = parseInt(cardNumber.slice(0, 4));

    return (number >= 5100 && number < 5600) || (number >= 2221 && number <= 2720);
  }

  // 16-19-digit Maestro card number starting with 50, 56, 57, 58, 6013, 62, 63, or 67
  private isMaestro(cardNumber: string): boolean {
    return (
      cardNumber.startsWith('50') ||
      cardNumber.startsWith('56') ||
      cardNumber.startsWith('57') ||
      cardNumber.startsWith('58') ||
      cardNumber.startsWith('6013') ||
      cardNumber.startsWith('62') ||
      cardNumber.startsWith('63') ||
      cardNumber.startsWith('67')
    );
  }

  // starting with 4
  private isVisa(cardNumber: string): boolean {
    return cardNumber.startsWith('4');
  }

  // American Express Credit Card Number (CCN) is a 15-digit number starting with 34 or 37
  private isAmericanExpress(cardNumber: string): boolean {
    return cardNumber.startsWith('34') || cardNumber.startsWith('37');
  }
}
