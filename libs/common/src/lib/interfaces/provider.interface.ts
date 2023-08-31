import { ProviderTypeEnum } from '../enums';
import { ProviderDataType } from '../types';
import { UserInterface } from './user.interface';

export interface ProviderInterface {
  providerType: ProviderTypeEnum;
  data: ProviderDataType;
  createdBy: UserInterface;
}
