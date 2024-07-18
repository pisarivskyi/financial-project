import { Expose } from 'class-transformer';

import { ProviderDataType, ProviderInterface, ProviderTypeEnum } from '@financial-project/common';

import { BaseModel } from '../../shared/models/base.model';

export class ProviderModel extends BaseModel implements ProviderInterface {
  @Expose()
  name!: string;

  @Expose()
  data!: ProviderDataType;

  @Expose()
  providerType!: ProviderTypeEnum;

  @Expose()
  createdBy!: string;
}
