import { Route } from '@angular/router';

export const budgetBuilderRoutes: Route[] = [
  {
    path: '',
    title: 'Budget - Budget builder',
    loadComponent: () =>
      import('./budget-builder-container/budget-builder-container.component').then(
        (mod) => mod.BudgetBuilderContainerComponent,
      ),
  },
];
