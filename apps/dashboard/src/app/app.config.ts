import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { NZ_CONFIG, NzConfig } from 'ng-zorro-antd/core/config';

import { appRoutes } from './app.routes';
import { FORM_AUTO_TIPS } from './shared/constants/form-auto-tips.const';

const ngZorroConfig: NzConfig = {
  form: {
    nzAutoTips: FORM_AUTO_TIPS,
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
  ],
};
