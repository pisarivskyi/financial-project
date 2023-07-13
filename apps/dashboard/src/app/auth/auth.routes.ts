import { Route } from '@angular/router';

import { RoutePathEnum } from '../core/enums/route-path.enum';
import { AuthShellComponent } from './auth-shell/auth-shell.component';

export const authRoutes: Route[] = [
  {
    path: '',
    component: AuthShellComponent,
    children: [
      {
        path: RoutePathEnum.SignIn,
        loadComponent: () =>
          import('./sign-in-container/sign-in-container.component').then((mod) => mod.SignInContainerComponent),
      },
      {
        path: `${RoutePathEnum.Password}/${RoutePathEnum.ResetRequest}`,
        loadComponent: () =>
          import('./password-reset-request-container/password-reset-request-container.component').then(
            (mod) => mod.PasswordResetRequestContainerComponent
          ),
      },
    ],
  },
];
