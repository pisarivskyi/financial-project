import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localeUk from '@angular/common/locales/uk';
import { APP_INITIALIZER, ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { devTools } from '@ngneat/elf-devtools';
import { KeycloakAngularModule, KeycloakBearerInterceptor } from 'keycloak-angular';

import { NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';

import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { AuthenticationService } from './core/authentication/services/authentication.service';
import { ConfigurationService } from './core/configuration/services/configuration.service';
import { ENVIRONMENT_CONFIG_TOKEN } from './core/configuration/tokens/environment-config.token';
import { nzConfigFactory } from './core/nz-config/nz-config.factory';

// for the future
registerLocaleData(localeUk, 'uk');

function initAppFactory(
  configurationService: ConfigurationService,
  authenticationService: AuthenticationService,
): () => Promise<any> {
  return () => {
    devTools({
      name: 'financial-project',
    });

    return authenticationService.init(configurationService.getConfiguration().keycloak);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'en-US' },
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(KeycloakAngularModule),
    provideAnimations(),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: initAppFactory,
      deps: [ConfigurationService, AuthenticationService],
    },
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: NZ_CONFIG,
      useFactory: nzConfigFactory,
    },
    { provide: ENVIRONMENT_CONFIG_TOKEN, useValue: environment },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true,
    },
  ],
};
