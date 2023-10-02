import { Type } from 'class-transformer';

import { ProviderAccountsInterface, ProviderTypeEnum } from '@financial-project/common';

import { ProviderAccountDataModel } from './provider-account-data.model';

export class ProviderAccountsModel implements ProviderAccountsInterface {
  clientId!: string;
  providerId!: string;
  providerType!: ProviderTypeEnum;

  @Type(() => ProviderAccountDataModel)
  accounts: ProviderAccountDataModel[] = [];
  originalData?: any;
}
