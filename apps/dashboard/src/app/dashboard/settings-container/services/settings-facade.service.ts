import { Injectable, inject } from '@angular/core';
import { createStore, select, setProp, withProps } from '@ngneat/elf';
import { getRequestResult, trackRequestResult } from '@ngneat/elf-requests';
import { map, tap } from 'rxjs';

import { SettingsModel } from '../../../api/settings/models/settings.model';
import { SettingsService } from '../../services/settings.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsFacadeService {
  readonly storyKey = 'settings';

  readonly requestKeys = {
    getSettings: 'getSettings',
  };

  store = createStore(
    { name: this.storyKey },
    withProps<{ settings: SettingsModel | null }>({
      settings: null,
    }),
  );

  settings$ = this.store.pipe(select((s) => s.settings));

  isLoading$ = getRequestResult([this.requestKeys.getSettings]).pipe(map(({ isLoading }) => isLoading));

  private settingService = inject(SettingsService);

  loadSettings(): void {
    this.settingService
      .getSettingsFromCache$()
      .pipe(
        tap((settings) => {
          this.store.update(setProp('settings', settings));
        }),
        trackRequestResult([this.requestKeys.getSettings], {
          skipCache: true,
        }),
      )
      .subscribe();
  }

  updateSettings(settingsToUpdate: SettingsModel): void {
    this.settingService
      .updateSettings$(settingsToUpdate)
      .pipe(
        tap((settings) => {
          this.store.update(setProp('settings', settings));
        }),
        trackRequestResult([this.requestKeys.getSettings], {
          skipCache: true,
        }),
      )
      .subscribe();
  }
}
