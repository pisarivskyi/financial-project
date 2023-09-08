import { ProviderTypeEnum } from '../enums';
import { ProviderDataType } from '../types';

export interface ProviderInterface {
  providerType: ProviderTypeEnum;
  data: ProviderDataType;
  createdBy: string;
}
