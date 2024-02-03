import { Injectable, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakConfig } from 'keycloak-js';
import { Observable, from } from 'rxjs';

import { UserInterface } from '@financial-project/common';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  keycloakService = inject(KeycloakService);

  init(config: KeycloakConfig): Promise<boolean> {
    return this.keycloakService.init({
      config,
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
      },
    });
  }

  logout$(redirectUrl?: string): Observable<void> {
    return from(this.keycloakService.logout(redirectUrl));
  }

  getProfile$(): Observable<UserInterface> {
    return from(this.keycloakService.loadUserProfile());
  }
}
