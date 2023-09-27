import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { AuthHttpInterceptor, AuthService, authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { Observable, filter, take } from 'rxjs';

import { NZ_CONFIG, NzConfig } from 'ng-zorro-antd/core/config';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';

import { environment } from '../../../../environments/environment';
import { appRoutes } from './app.routes';
import { ENVIRONMENT_CONFIG_TOKEN } from './core/configuration/tokens/environment-config.token';
import { FORM_AUTO_TIPS } from './shared/constants/form-auto-tips.const';
import { devTools } from '@ngneat/elf-devtools';

const ngZorroConfig: NzConfig = {
  form: {
    nzAutoTips: FORM_AUTO_TIPS,
  },
};

function initAppFactory(): () => void {
  return () => devTools({
    name: 'financial-project',
  });

  // return () =>
  //   authService.isLoading$.pipe(
  //     filter((b) => b),
  //     take(1)
  //   );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    provideAuth0({
      domain: environment.auth0Domain,
      clientId: environment.auth0ClientId,
      authorizationParams: {
        audience: environment.auth0Audience,
        redirect_uri: window.location.origin,
      },
      httpInterceptor: {
        allowedList: environment.auth0HttpInterceptorConfig,
      },
    }),
    provideAnimations(),
    { provide: APP_INITIALIZER, multi: true, useFactory: initAppFactory, deps: [] },
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
    { provide: ENVIRONMENT_CONFIG_TOKEN, useValue: environment },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
  ],
};
