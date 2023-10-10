import { IssuerEnum } from '@financial-project/common';

export const ISSUER_TO_LOGO = {
  [IssuerEnum.Maestro]: '/assets/issuer logos/maestro.svg',
  [IssuerEnum.Visa]: '/assets/issuer logos/visa.svg',
  [IssuerEnum.MasterCard]: '/assets/issuer logos/mastercard.svg',
  [IssuerEnum.AmericanExpress]: '/assets/issuer logos/amex.svg',
  [IssuerEnum.Unknown]: '/assets/issuer logos/unknown.svg',
};
