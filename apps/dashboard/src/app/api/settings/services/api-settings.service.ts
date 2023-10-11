import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { SettingsInterface } from '@financial-project/common';

import { HttpMethodEnum } from '../../../core/communication/enums/http-method.enum';
import { CommunicationService } from '../../../core/communication/services/communication.service';
import { SettingsModel } from '../models/settings.model';
import { ApiSettingsTransformService } from './api-settings-transform.service';

@Injectable({
  providedIn: 'root',
})
export class ApiSettingsService {
  readonly requests = {
    settings: '/settings',
  };

  constructor(
    private apiSettingsTransformService: ApiSettingsTransformService,
    private communicationService: CommunicationService
  ) {}

  extractSettings$(): Observable<SettingsModel> {
    return this.communicationService
      .makeRequest<SettingsInterface>({
        method: HttpMethodEnum.Get,
        path: this.requests.settings,
      })
      .pipe(map((response) => this.apiSettingsTransformService.fromExtractSettings(response)));
  }

  updateSettings$(settingsToUpdate: SettingsModel): Observable<SettingsModel> {
    return this.communicationService
      .makeRequest<SettingsInterface>({
        method: HttpMethodEnum.Patch,
        path: this.requests.settings,
        payload: this.apiSettingsTransformService.toUpdateSettings(settingsToUpdate),
      })
      .pipe(map((response) => this.apiSettingsTransformService.fromUpdateSettings(response)));
  }
}
