import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';

import { BudgetModel } from '../../api/budgets/models/budget.model';
import { PageHeaderActionInterface } from '../../shared/components/page-header/interfaces/page-header-action.interface';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { AmountFormatPipe } from '../../shared/pipes/amount-format/amount-format.pipe';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format/currency-format.pipe';
import { AddBudgetModalComponent } from './components/add-budget-modal/add-budget-modal.component';
import { EditBudgetModalComponent } from './components/edit-budget-modal/edit-budget-modal.component';
import { BudgetsFacadeService } from './services/budgets-facade.service';

@UntilDestroy()
@Component({
  selector: 'fpd-budgets-container',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzPopconfirmModule,
    NzTableModule,
    NzModalModule,
    NzMessageModule,
    NzIconModule,
    PageHeaderComponent,
    AmountFormatPipe,
    CurrencyFormatPipe,
  ],
  templateUrl: './budgets-container.component.html',
  styleUrls: ['./budgets-container.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetsContainerComponent implements OnInit {
  budgets$ = this.budgetsFacadeService.budgets$;

  isLoading$ = this.budgetsFacadeService.isLoading$;

  pagination$ = this.budgetsFacadeService.pagination$;

  actions: PageHeaderActionInterface[] = [
    {
      label: 'Add budget',
      type: 'primary',
      action: () => {
        this.onAddBudget();
      },
    },
  ];

  constructor(
    private budgetsFacadeService: BudgetsFacadeService,
    private modalService: NzModalService,
    private messageService: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe(({ page, size }) => {
      if (!page) {
        this.changeRouteQueryParams({ page: 1 }, true);
      } else {
        page = Number(page ?? 1);
        size = Number(size ?? 10);

        this.budgetsFacadeService.updatePagination(page, size);

        this.budgetsFacadeService.loadBudgets();
      }
    });
  }

  onAddBudget(): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Add new budget',
      nzContent: AddBudgetModalComponent,
      nzCentered: true,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.budgetsFacadeService.loadBudgets();

        this.messageService.success('Budget was created');
      }
    });
  }

  onEditBudget(budget: BudgetModel): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Edit budget',
      nzContent: EditBudgetModalComponent,
      nzCentered: true,
      nzData: budget,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.budgetsFacadeService.loadBudgets();

        this.messageService.success('Budget was updated');
      }
    });
  }

  onDeleteBudget(budget: BudgetModel): void {
    this.budgetsFacadeService.deleteBudget$(budget.id).subscribe(() => {
      this.budgetsFacadeService.loadBudgets();

      this.messageService.success('Budget item was deleted');
    });
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
