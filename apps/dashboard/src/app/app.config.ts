import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { Observable, filter, take } from 'rxjs';

import { NZ_CONFIG, NzConfig } from 'ng-zorro-antd/core/config';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';

import { appRoutes } from './app.routes';
import { AuthenticationService } from './core/authentication/services/authentication.service';
import { FORM_AUTO_TIPS } from './shared/constants/form-auto-tips.const';

const ngZorroConfig: NzConfig = {
  form: {
    nzAutoTips: FORM_AUTO_TIPS,
  },
};

function initAppFactory(authService: AuthenticationService): () => Observable<any> {
  authService.getSession$().subscribe();

  return () =>
    authService.isLoading$.pipe(
      filter((b) => b),
      take(1)
    );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    { provide: APP_INITIALIZER, multi: true, useFactory: initAppFactory, deps: [AuthenticationService] },
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
  ],
};
