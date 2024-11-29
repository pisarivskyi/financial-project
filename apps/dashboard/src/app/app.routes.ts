import { Route } from '@angular/router';

import { authorizedOnlyGuard } from './core/authentication/guards/authorized-only.guard';
import { RoutePathEnum } from './core/routing/enums/route-path.enum';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: RoutePathEnum.Dashboard,
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
