import { ProviderTypeEnum } from '../enums';
import { ProviderDataType } from '../types';

export interface ProviderInterface {
  name: string;
  providerType: ProviderTypeEnum;
  data: ProviderDataType;
  createdBy: string;
}
