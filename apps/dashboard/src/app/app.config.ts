import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import localeUk from '@angular/common/locales/uk';
import { APP_INITIALIZER, ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { AuthHttpInterceptor, AuthService, authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { devTools } from '@ngneat/elf-devtools';
import { Observable, filter, take } from 'rxjs';

import { NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';

import { environment } from '../../../../environments/environment';
import { appRoutes } from './app.routes';
import { ENVIRONMENT_CONFIG_TOKEN } from './core/configuration/tokens/environment-config.token';
import { nzConfigFactory } from './core/nz-config/nz-config.factory';

// for the future
registerLocaleData(localeUk, 'uk');

function initAppFactory(authService: AuthService): () => Observable<any> {
  return () => {
    devTools({
      name: 'financial-project',
    });

    return authService.isLoading$.pipe(
      filter((b) => !b),
      take(1)
    );
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'en-US' },
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
    { provide: APP_INITIALIZER, multi: true, useFactory: initAppFactory, deps: [AuthService] },
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: NZ_CONFIG,
      useFactory: nzConfigFactory,
    },
    { provide: ENVIRONMENT_CONFIG_TOKEN, useValue: environment },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
  ],
};
