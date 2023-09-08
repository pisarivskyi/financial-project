import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, filter, map, switchMap } from 'rxjs';

import { RoutePathEnum } from '../../enums/route-path.enum';

export const authorizedOnlyGuard = (): Observable<boolean> => {
  const authService = inject(AuthService);
  return authService.isLoading$.pipe(
    filter((isLoading) => isLoading),
    switchMap(() => authService.user$),
    map((currentUser) => {
      if (currentUser === null) {
        location.href = `/${RoutePathEnum.Auth}/${RoutePathEnum.SignIn}?redirectTo=${encodeURIComponent(
          `${location.pathname}${location.search}`
        )}`;
      }

      return Boolean(currentUser);
    })
  );
};
