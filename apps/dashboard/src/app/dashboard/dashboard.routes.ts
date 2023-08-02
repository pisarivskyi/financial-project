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
        redirectTo: RoutePathEnum.Records,
      },
      {
        path: RoutePathEnum.Records,
        loadComponent: () => import('./records-container/records-container.component').then((mod) => mod.RecordsContainerComponent),
      },
      {
        path: RoutePathEnum.Categories,
        loadComponent: () =>
          import('./categories-container/categories-container.component').then(
            (mod) => mod.CategoriesContainerComponent
          ),
      },
    ],
  },
];
