import { Route } from '@angular/router';

import { RoutePathEnum } from './core/enums/route-path.enum';
import { authorizedOnlyGuard } from './core/authentication/guards/authorized-only.guard';

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
