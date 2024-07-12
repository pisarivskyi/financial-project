import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';

import { CategoryModel } from '../../api/categories/models/category.model';
import { PageHeaderActionInterface } from '../../shared/components/page-header/interfaces/page-header-action.interface';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { AddCategoryModalComponent } from './components/add-category-modal/add-category-modal.component';
import { EditCategoryModalComponent } from './components/edit-category-modal/edit-category-modal.component';
import { CategoriesFacadeService } from './services/categories-facade.service';

export interface CategoryNodeInterface {
  current: CategoryModel;
  children: CategoryNodeInterface[];
}

@UntilDestroy()
@Component({
  selector: 'fpd-categories-container',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzPopconfirmModule, NzTableModule, NzIconModule, PageHeaderComponent],
  templateUrl: './categories-container.component.html',
  styleUrls: ['./categories-container.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesContainerComponent implements OnInit {
  categories$ = this.categoriesFacadeService.categories$;

  isLoading$ = this.categoriesFacadeService.isLoading$;

  pagination$ = this.categoriesFacadeService.pagination$;

  actions: PageHeaderActionInterface[] = [
    {
      label: 'Add category',
      type: 'primary',
      action: () => {
        this.onAddCategory();
      },
    },
  ];

  constructor(
    private categoriesFacadeService: CategoriesFacadeService,
    private modalService: NzModalService,
    private messageService: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe(({ page, size }) => {
      if (!page) {
        this.changeRouteQueryParams({ page: 1 }, true);
      } else {
        page = Number(page ?? 1);
        size = Number(size ?? 10);

        this.categoriesFacadeService.updatePagination(page, size);

        this.categoriesFacadeService.loadCategories();
      }
    });
  }

  getCategoriesTree(categories: CategoryModel[]): CategoryNodeInterface[] {
    const map = new Map<string, CategoryNodeInterface>();
    const roots: CategoryNodeInterface[] = [];

    for (const category of categories) {
      map.set(category.id, {
        current: category,
        children: [],
      });
    }

    for (const category of categories) {
      const node = map.get(category.id);

      if (category.parentCategory) {
        const parent = map.get(category.parentCategory.id);

        if (parent && node) {
          parent.children.push(node);
        }
      }

      if (!category.parentCategory) {
        const node = map.get(category.id);

        if (node) {
          roots.push(node);
        }
      }
    }

    return roots;
  }

  onAddCategory(): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Add new category',
      nzContent: AddCategoryModalComponent,
      nzCentered: true,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.categoriesFacadeService.loadCategories();

        this.messageService.success('Category item was created');
      }
    });
  }

  onEditCategory(category: CategoryModel): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Edit category',
      nzContent: EditCategoryModalComponent,
      nzCentered: true,
      nzData: category,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.categoriesFacadeService.loadCategories();

        this.messageService.success('Category item was updated');
      }
    });
  }

  onDeleteCategory(category: CategoryModel): void {
    this.categoriesFacadeService.deleteCategory$(category.id).subscribe(() => {
      this.categoriesFacadeService.loadCategories();

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
