import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';

import { ExpanseCategory } from '../../api/expanse-categories/models/expanse-category.model';
import { AddExpanseCategoryModalComponent } from './components/add-expanse-category-modal/add-expanse-category-modal.component';
import { EditExpanseCategoryModalComponent } from './components/edit-expanse-category-modal/edit-expanse-category-modal.component';
import { ExpanseCategoriesFacadeService } from './services/expanse-categories-facade.service';

@UntilDestroy()
@Component({
  selector: 'fpd-expanse-categories-container',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzPopconfirmModule, NzTableModule, NzModalModule, NzMessageModule],
  templateUrl: './expanse-categories-container.component.html',
  styleUrls: ['./expanse-categories-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpanseCategoriesContainerComponent implements OnInit {
  expanseCategories$ = this.expanseCategoriesFacadeService.expanseCategories$;

  isLoading$ = this.expanseCategoriesFacadeService.isLoading$;

  pagination$ = this.expanseCategoriesFacadeService.pagination$;

  constructor(
    private expanseCategoriesFacadeService: ExpanseCategoriesFacadeService,
    private modalService: NzModalService,
    private messageService: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe(({ page, size }) => {
      page = Number(page ?? 1);
      size = Number(size ?? 20);

      this.expanseCategoriesFacadeService.updatePagination({
        pageIndex: page,
        pageSize: size,
      });

      this.expanseCategoriesFacadeService.getExpanseCategories();
    });

    this.pagination$.pipe(untilDestroyed(this)).subscribe((pagination) => {
      this.router.navigate(['./'], {
        queryParams: { page: pagination.pageIndex, size: pagination.pageSize },
        relativeTo: this.activatedRoute,
        replaceUrl: false,
      });
    });
  }

  onAddNewExpanseCategory(): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Add new expanse',
      nzContent: AddExpanseCategoryModalComponent,
      nzCentered: true,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.expanseCategoriesFacadeService.getExpanseCategories();

        this.messageService.success('Expanse category item was created');
      }
    });
  }

  onEditExpanseCategory(expanseCategory: ExpanseCategory): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Edit expanse',
      nzContent: EditExpanseCategoryModalComponent,
      nzCentered: true,
      nzData: expanseCategory,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.expanseCategoriesFacadeService.getExpanseCategories();

        this.messageService.success('Expanse category item was updated');
      }
    });
  }

  onDeleteExpanseCategory(expanseCategory: ExpanseCategory): void {
    this.expanseCategoriesFacadeService.deleteExpanseCategory(expanseCategory.id).subscribe(() => {
      this.expanseCategoriesFacadeService.getExpanseCategories();

      this.messageService.success('Expanse category item was deleted');
    });
  }

  onPageIndexChanged(pageIndex: number): void {
    this.router.navigate(['./'], {
      queryParams: { page: pageIndex },
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
      replaceUrl: false,
    });
  }
}
