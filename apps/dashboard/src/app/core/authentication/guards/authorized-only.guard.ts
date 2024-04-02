import { inject } from '@angular/core';
import { CanMatchFn, UrlTree } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

export const authorizedOnlyGuard: CanMatchFn = async (): Promise<boolean | UrlTree> => {
  const keycloakService = inject(KeycloakService);

  const authenticated: boolean = await keycloakService.isLoggedIn();

  if (!authenticated) {
    await keycloakService.login({
      redirectUri: window.location.origin + window.location.pathname + window.location.search,
    });
  }

  return true;
};
