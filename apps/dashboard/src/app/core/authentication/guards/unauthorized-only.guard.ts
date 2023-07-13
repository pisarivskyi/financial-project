import { inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';
import { Router, UrlTree } from '@angular/router';

export const unauthorizedOnlyGuard = (): Observable<boolean | UrlTree> => {
  return inject(AuthenticationService).getCurrentUser$().pipe(
    map((currentUser) => {
      return !currentUser || inject(Router).parseUrl('/');
    })
  );
}
