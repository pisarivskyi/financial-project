import { OmitType } from '@nestjs/swagger';

import { ProviderEntity } from '../entities/provider.entity';

export class CreateProviderDto extends OmitType(ProviderEntity, [
  'createdBy',
  'createdAt',
  'id',
  'updatedAt',
  'providerType',
]) {}
