import { Route } from '@angular/router';

import { RoutePathEnum } from '../../core/enums/route-path.enum';
import { PlannedPaymentsCalendarTabComponent } from './components/planned-payments-calendar-tab/planned-payments-calendar-tab.component';
import { PlannedPaymentsTableTabComponent } from './components/planned-payments-table-tab/planned-payments-table-tab.component';
import { PlannedPaymentsContainerComponent } from './planned-payments-container.component';

export const paymentRoutes: Route[] = [
  {
    path: '',
    component: PlannedPaymentsContainerComponent,
    children: [
      {
        path: RoutePathEnum.Calendar,
        title: 'Budget - Planned payments calendar',
        component: PlannedPaymentsCalendarTabComponent,
      },
      {
        path: RoutePathEnum.Table,
        title: 'Budget - Planned payments table',
        component: PlannedPaymentsTableTabComponent,
      },
      {
        path: '**',
        redirectTo: RoutePathEnum.Calendar,
      },
    ],
  },
];
