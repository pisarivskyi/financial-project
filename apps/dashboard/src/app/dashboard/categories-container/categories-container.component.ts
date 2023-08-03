import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';

import { Category } from '../../api/categories/models/category.model';
import { AddCategoryModalComponent } from './components/add-category-modal/add-category-modal.component';
import { EditCategoryModalComponent } from './components/edit-category-modal/edit-category-modal.component';
import { CategoriesFacadeService } from './services/categories-facade.service';

@UntilDestroy()
@Component({
  selector: 'fpd-categories-container',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzPopconfirmModule, NzTableModule, NzModalModule, NzMessageModule],
  templateUrl: './categories-container.component.html',
  styleUrls: ['./categories-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesContainerComponent implements OnInit {
  categories$ = this.categoriesFacadeService.categories$;

  isLoading$ = this.categoriesFacadeService.isLoading$;

  pagination$ = this.categoriesFacadeService.pagination$;

  constructor(
    private categoriesFacadeService: CategoriesFacadeService,
    private modalService: NzModalService,
    private messageService: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe(({ page, size }) => {
      if (!page) {
        this.changeRouteQueryParams({ page: 1, size: 20 }, true);
      } else {
        page = Number(page ?? 1);
        size = Number(size ?? 20);

        this.categoriesFacadeService.updatePagination({
          pageIndex: page,
          pageSize: size,
        });

        this.categoriesFacadeService.getCategories();
      }
    });

    this.pagination$.pipe(untilDestroyed(this)).subscribe((pagination) => {
      this.router.navigate(['./'], {
        queryParams: { page: pagination.pageIndex, size: pagination.pageSize },
        relativeTo: this.activatedRoute,
        replaceUrl: false,
      });
    });
  }

  onAddCategory(): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Add new category',
      nzContent: AddCategoryModalComponent,
      nzCentered: true,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.categoriesFacadeService.getCategories();

        this.messageService.success('Category item was created');
      }
    });
  }

  onEditCategory(category: Category): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Edit category',
      nzContent: EditCategoryModalComponent,
      nzCentered: true,
      nzData: category,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.categoriesFacadeService.getCategories();

        this.messageService.success('Category item was updated');
      }
    });
  }

  onDeleteCategory(category: Category): void {
    this.categoriesFacadeService.deleteCategory$(category.id).subscribe(() => {
      this.categoriesFacadeService.getCategories();

      this.messageService.success('Category item was deleted');
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
