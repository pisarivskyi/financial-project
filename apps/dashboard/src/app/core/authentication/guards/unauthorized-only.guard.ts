import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';

export const unauthorizedOnlyGuard = (): Observable<boolean | UrlTree> => {
  return inject(AuthenticationService)
    .getCurrentUser$()
    .pipe(
      map((currentUser) => {
        return !currentUser || inject(Router).parseUrl('/');
      })
    );
};
