import { Route } from '@angular/router';

import { RoutePathEnum } from '../../core/routing/enums/route-path.enum';

export const budgetPlansRoutes: Route[] = [
  {
    path: RoutePathEnum.Builder,
    title: 'Budget - Budget builder',
    loadComponent: () =>
      import('./budget-builder/budget-builder-container.component').then((mod) => mod.BudgetBuilderContainerComponent),
  },
  {
    path: '**',
    redirectTo: RoutePathEnum.Builder,
  },
];
