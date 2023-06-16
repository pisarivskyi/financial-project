import { Route } from '@angular/router';

import { RoutePathEnum } from '../core/enums/route-path.enum';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: RoutePathEnum.Expanses,
  },
  {
    path: RoutePathEnum.Expanses,
    loadComponent: () => import('./expanses-page/expanses-page.component').then(mod => mod.ExpansesPageComponent),
  },
  {
    path: RoutePathEnum.ExpanseCategories,
    loadComponent: () => import('./expanse-categories-page/expanse-categories-page.component').then(mod => mod.ExpanseCategoriesPageComponent),
  }
];
