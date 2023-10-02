import { Injectable } from '@nestjs/common';

import { ProviderTypeEnum } from '@financial-project/common';

import { CreateProviderDto } from '../dto/create-provider.dto';
import { ProviderEntity } from '../entities/provider.entity';

@Injectable()
export class ProviderFactoryService {
  create(provider: ProviderTypeEnum, providerDto: CreateProviderDto): ProviderEntity {
    switch (provider) {
      case ProviderTypeEnum.Monobank: {
        return this.createMonobankProvider(providerDto);
      }

      default: {
        throw new Error('No such provider');
      }
    }
  }

  private createMonobankProvider(providerDto: CreateProviderDto): ProviderEntity {
    const provider = new ProviderEntity();
    provider.name = providerDto.name;
    provider.providerType = ProviderTypeEnum.Monobank;
    provider.data = providerDto.data;

    return provider;
  }
}
