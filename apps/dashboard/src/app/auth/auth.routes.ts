import { Route } from '@angular/router';
import { RoutePathEnum } from '../core/enums/route-path.enum';

export const authRoutes: Route[] = [
  {
    path: RoutePathEnum.SignIn,
    loadComponent: () => import('./sign-in-page/sign-in-page.component').then(mod => mod.SignInPageComponent)
  }
];
