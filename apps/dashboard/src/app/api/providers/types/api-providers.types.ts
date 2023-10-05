import { OmitFields } from '@financial-project/common';

import { ProviderModel } from '../models/provider.model';

export type SaveProviderAccountsType = {
  accountIds: string[];
};

export type InsertProviderType = OmitFields<Omit<ProviderModel, 'providerType'>>;

export type UpdateProviderType = Pick<ProviderModel, 'name'>;
