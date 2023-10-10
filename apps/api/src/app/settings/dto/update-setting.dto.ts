import { PartialType } from '@nestjs/mapped-types';
import { OmitType } from '@nestjs/swagger';

import { SettingsEntity } from '../entities/settings.entity';

export class UpdateSettingDto extends PartialType(
  OmitType(SettingsEntity, ['id', 'createdAt', 'updatedAt', 'createdBy'])
) {}
