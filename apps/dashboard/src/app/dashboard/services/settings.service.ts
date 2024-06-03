import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';

import { SettingsModel } from '../../api/settings/models/settings.model';
import { ApiSettingsService } from '../../api/settings/services/api-settings.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private settings$ = new BehaviorSubject<SettingsModel | null>(null);

  private apiSettingsService = inject(ApiSettingsService);

  getSettings$(): Observable<SettingsModel> {
    return this.apiSettingsService.extractSettings$().pipe(tap((settings) => this.settings$.next(settings)));
  }

  getSettingsFromCache$(): Observable<SettingsModel> {
    if (this.settings$.value) {
      return this.settings$.asObservable().pipe(take(1)) as unknown as Observable<SettingsModel>;
    }

    return this.getSettings$();
  }

  getSettingsSync(): SettingsModel {
    return this.settings$.value!;
  }

  updateSettings$(settingsToUpdate: SettingsModel): Observable<SettingsModel> {
    return this.apiSettingsService
      .updateSettings$(settingsToUpdate)
      .pipe(tap((settings) => this.settings$.next(settings)));
  }
}
