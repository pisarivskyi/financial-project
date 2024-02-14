import { Injectable, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakConfig } from 'keycloak-js';
import { Observable, from } from 'rxjs';

import { UserProfileInterface } from '@financial-project/common';

import { ConfigurationService } from '../../configuration/services/configuration.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  keycloakService = inject(KeycloakService);
  configurationService = inject(ConfigurationService);

  init(config: KeycloakConfig): Promise<boolean> {
    return this.keycloakService.init({
      config,
      initOptions: {
        checkLoginIframe: false,
        ...(this.configurationService.getConfiguration().production
          ? { onLoad: 'check-sso', silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html' }
          : {}),
      },
    });
  }

  logout$(redirectUrl?: string): Observable<void> {
    return from(this.keycloakService.logout(redirectUrl));
  }

  getProfile$(): Observable<UserProfileInterface> {
    return from(this.keycloakService.loadUserProfile());
  }
}
