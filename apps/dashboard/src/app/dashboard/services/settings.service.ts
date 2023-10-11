import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { SettingsModel } from '../../api/settings/models/settings.model';
import { ApiSettingsService } from '../../api/settings/services/api-settings.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private apiSettingsService = inject(ApiSettingsService);

  getSettings$(): Observable<SettingsModel> {
    return this.apiSettingsService.extractSettings$();
  }

  updateSettings$(settingsToUpdate: SettingsModel): Observable<SettingsModel> {
    return this.apiSettingsService.updateSettings$(settingsToUpdate);
  }
}
