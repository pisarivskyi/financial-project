import { PartialType } from '@nestjs/swagger';

import { ProviderEntity } from '../entities/provider.entity';

export class UpdateProviderDto extends PartialType(ProviderEntity) {}
