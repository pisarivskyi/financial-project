import { Route } from '@angular/router';

import { RoutePathEnum } from '../core/enums/route-path.enum';
import { DashboardShellComponent } from './dashboard-shell/dashboard-shell.component';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    component: DashboardShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: RoutePathEnum.Expanses,
      },
      {
        path: RoutePathEnum.Expanses,
        loadComponent: () => import('./expanses-container/expanses-container.component').then((mod) => mod.ExpansesContainerComponent),
      },
      {
        path: RoutePathEnum.ExpanseCategories,
        loadComponent: () =>
          import('./expanse-categories-container/expanse-categories-container.component').then(
            (mod) => mod.ExpanseCategoriesContainerComponent
          ),
      },
    ],
  },
];
