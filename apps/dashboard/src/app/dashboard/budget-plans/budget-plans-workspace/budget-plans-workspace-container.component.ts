import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs';

import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';

import { RoutePathEnum } from '../../../core/routing/enums/route-path.enum';
import { PageHeaderActionInterface } from '../../../shared/components/page-header/interfaces/page-header-action.interface';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { BudgetPlansWorkspaceFacadeService } from './services/budget-plans-workspace-facade.service';

@UntilDestroy()
@Component({
  selector: 'fpd-budget-plans-workspace-container',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, NzTableModule, NzButtonModule, NzButtonComponent],
  templateUrl: './budget-plans-workspace-container.component.html',
  styleUrl: './budget-plans-workspace-container.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetPlansWorkspaceContainerComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private budgetPlansWorkspaceFacadeService = inject(BudgetPlansWorkspaceFacadeService);

  budgetPlans$ = this.budgetPlansWorkspaceFacadeService.budgetPlans$;

  isLoading$ = this.budgetPlansWorkspaceFacadeService.isLoading$;

  pagination$ = this.budgetPlansWorkspaceFacadeService.pagination$;

  actions: PageHeaderActionInterface[] = [
    {
      label: 'Add budget plan',
      type: 'primary',
      action: () => {
        this.onGenerateBudgetPlan();
      },
    },
  ];

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe(({ page, size }) => {
      if (!page) {
        this.changeRouteQueryParams({ page: 1, size: 20 }, true);
      } else {
        page = Number(page ?? 1);
        size = Number(size ?? 20);

        this.budgetPlansWorkspaceFacadeService.updatePagination(page, size);

        this.budgetPlansWorkspaceFacadeService.loadBudgetPlans();
      }
    });
  }

  onGenerateBudgetPlan(): void {
    this.router.navigate([RoutePathEnum.Dashboard, RoutePathEnum.BudgetPlans, RoutePathEnum.Builder]);
  }

  onPageIndexChanged(pageIndex: number): void {
    this.activatedRoute.queryParams.pipe(take(1)).subscribe((queryParams) => {
      this.changeRouteQueryParams({
        ...queryParams,
        page: pageIndex,
      });
    });
  }

  private changeRouteQueryParams(queryParams: Params, replaceUrl = false): void {
    this.router.navigate(['./'], {
      queryParams,
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
      replaceUrl,
    });
  }
}
