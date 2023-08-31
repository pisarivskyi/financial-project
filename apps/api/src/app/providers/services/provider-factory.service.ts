import { Injectable } from '@nestjs/common';

import { MonobankProviderDataInterface, ProviderDataType, ProviderTypeEnum } from '@financial-project/common';

import { ProviderEntity } from '../entities/provider.entity';

@Injectable()
export class ProviderFactoryService {
  create(provider: ProviderTypeEnum, data: ProviderDataType): ProviderEntity {
    switch (provider) {
      case ProviderTypeEnum.Monobank: {
        return this.createMonobankProvider(data);
      }

      default: {
        throw new Error('No such provider');
      }
    }
  }

  private createMonobankProvider(data: MonobankProviderDataInterface): ProviderEntity {
    const provider = new ProviderEntity();
    provider.providerType = ProviderTypeEnum.Monobank;
    provider.data = data;

    return provider;
  }
}
