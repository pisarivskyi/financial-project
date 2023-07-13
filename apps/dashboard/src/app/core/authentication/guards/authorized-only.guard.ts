import { inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { RoutePathEnum } from '../../enums/route-path.enum';
import { AuthenticationService } from '../services/authentication.service';

export const authorizedOnlyGuard = (): Observable<boolean> => {
  return inject(AuthenticationService)
    .getCurrentUser$()
    .pipe(
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
