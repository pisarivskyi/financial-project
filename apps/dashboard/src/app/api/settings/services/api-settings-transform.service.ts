import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';

import { SettingsInterface } from '@financial-project/common';

import { SettingsModel } from '../models/settings.model';
import { UpdateSettingsDataType } from '../types/api-settings.types';

@Injectable({
  providedIn: 'root',
})
export class ApiSettingsTransformService {
  fromExtractSettings(response: SettingsInterface): SettingsModel {
    return this.toSettingsModel(response);
  }

  toUpdateSettings({ defaultCurrencyCode, billingPeriodStartDayNumber }: SettingsModel): UpdateSettingsDataType {
    return {
      defaultCurrencyCode,
      billingPeriodStartDayNumber,
    };
  }

  fromUpdateSettings(response: SettingsInterface): SettingsModel {
    return this.toSettingsModel(response);
  }

  private toSettingsModel(plain: SettingsInterface): SettingsModel {
    return plainToInstance(SettingsModel, plain);
  }
}
