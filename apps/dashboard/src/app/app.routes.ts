import { Route } from '@angular/router';

import { authorizedOnlyGuard } from './core/authentication/guards/authorized-only.guard';
import { unauthorizedOnlyGuard } from './core/authentication/guards/unauthorized-only.guard';
import { RoutePathEnum } from './core/enums/route-path.enum';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: RoutePathEnum.Dashboard,
  },
  {
    path: RoutePathEnum.Auth,
    loadChildren: () => import('./auth/auth.routes').then((mod) => mod.authRoutes),
    canActivate: [unauthorizedOnlyGuard],
  },
  {
    path: RoutePathEnum.Dashboard,
    loadChildren: () => import('./dashboard/dashboard.routes').then((mod) => mod.dashboardRoutes),
    canActivate: [authorizedOnlyGuard],
  },
  {
    path: '**',
    redirectTo: RoutePathEnum.Dashboard,
  },
];
