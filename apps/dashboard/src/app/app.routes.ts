import { Route } from '@angular/router';
import { RoutePathEnum } from './core/enums/route-path.enum';

export const appRoutes: Route[] = [
  {
    path: RoutePathEnum.Auth,
    loadChildren: () => import('./auth/auth.routes').then(mod => mod.authRoutes)
  },
  {
    path: RoutePathEnum.Dashboard,
    loadChildren: () => import('./dashboard/dashboard.routes').then(mod => mod.dashboardRoutes)
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
