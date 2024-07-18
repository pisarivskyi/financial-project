import { Route } from '@angular/router';

import { RoutePathEnum } from '../core/routing/enums/route-path.enum';
import { budgetPlansRoutes } from './budget-plans/budget-plans.routes';
import { paymentRoutes } from './planned-payments-container/planned-payments-container.routes';
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
        title: 'Budget - Analytics',
        loadComponent: () =>
          import('./analytics-container/analytics-container.component').then((mod) => mod.AnalyticsContainerComponent),
      },
      {
        path: RoutePathEnum.Providers,
        title: 'Budget - Banks',
        loadComponent: () =>
          import('./providers-container/providers-container.component').then((mod) => mod.ProvidersContainerComponent),
      },
      {
        path: RoutePathEnum.Accounts,
        title: 'Budget - Accounts',
        loadComponent: () =>
          import('./accounts-container/accounts-container.component').then((mod) => mod.AccountsContainerComponent),
      },
      {
        path: RoutePathEnum.Records,
        title: 'Budget - Records',
        loadComponent: () =>
          import('./records-container/records-container.component').then((mod) => mod.RecordsContainerComponent),
      },
      {
        path: RoutePathEnum.Categories,
        title: 'Budget - Categories',
        loadComponent: () =>
          import('./categories-container/categories-container.component').then(
            (mod) => mod.CategoriesContainerComponent,
          ),
      },
      {
        path: RoutePathEnum.Budgets,
        title: 'Budget - Budgets',
        loadComponent: () =>
          import('./budgets-container/budgets-container.component').then((mod) => mod.BudgetsContainerComponent),
      },
      {
        path: RoutePathEnum.BudgetPlans,
        loadChildren: () => budgetPlansRoutes,
      },
      {
        path: RoutePathEnum.Settings,
        title: 'Budget - Settings',
        loadComponent: () =>
          import('./settings-container/settings-container.component').then((mod) => mod.SettingsContainerComponent),
      },
      {
        path: RoutePathEnum.PlannedPayments,
        loadChildren: () => paymentRoutes,
      },
    ],
  },
];
