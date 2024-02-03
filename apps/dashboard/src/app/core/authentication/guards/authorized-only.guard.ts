import { inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { CanMatchFn, UrlTree } from '@angular/router';

export const authorizedOnlyGuard: CanMatchFn = async (): Promise<boolean | UrlTree> => {
  const keycloakService = inject(KeycloakService);

  const authenticated: boolean = await keycloakService.isLoggedIn();

  if (!authenticated) {
    await keycloakService.login({
      redirectUri: window.location.origin,
    });
  }

  return true;
};
