import { Route } from '@angular/router';

import { RoutePathEnum } from '../core/enums/route-path.enum';
import { ShellComponent } from './shell/shell.component';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: RoutePathEnum.Analytics,
      },
      {
        path: RoutePathEnum.Analytics,
        loadComponent: () =>
          import('./analytics-container/analytics-container.component').then((mod) => mod.AnalyticsContainerComponent),
      },
      {
        path: RoutePathEnum.Providers,
        loadComponent: () =>
          import('./providers-container/providers-container.component').then((mod) => mod.ProvidersContainerComponent),
      },
      {
        path: RoutePathEnum.Accounts,
        loadComponent: () =>
          import('./accounts-container/accounts-container.component').then((mod) => mod.AccountsContainerComponent),
      },
      {
        path: RoutePathEnum.Records,
        loadComponent: () =>
          import('./records-container/records-container.component').then((mod) => mod.RecordsContainerComponent),
      },
      {
        path: RoutePathEnum.Categories,
        loadComponent: () =>
          import('./categories-container/categories-container.component').then(
            (mod) => mod.CategoriesContainerComponent
          ),
      },
      {
        path: RoutePathEnum.Budgets,
        loadComponent: () =>
          import('./budgets-container/budgets-container.component').then((mod) => mod.BudgetsContainerComponent),
      },
      {
        path: RoutePathEnum.Settings,
        loadComponent: () =>
          import('./settings-container/settings-container.component').then((mod) => mod.SettingsContainerComponent),
      },
    ],
  },
];
