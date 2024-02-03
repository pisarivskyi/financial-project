// TODO
// import { inject } from '@angular/core';
// import { Router, UrlTree } from '@angular/router';
// import { AuthService } from '@auth0/auth0-angular';
// import { Observable, filter, map, switchMap } from 'rxjs';
//
// export const unauthorizedOnlyGuard = (): Observable<boolean | UrlTree> => {
//   const authService = inject(AuthService);
//
//   return authService.isLoading$.pipe(
//     filter((isLoading) => !isLoading),
//     switchMap(() => authService.user$),
//     map((currentUser) => {
//       return !currentUser || inject(Router).parseUrl('/');
//     })
//   );
// };
