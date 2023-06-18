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
        loadComponent: () => import('./sign-in-page/sign-in-page.component').then(mod => mod.SignInPageComponent)
      }
    ]
  },
];
