import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { CategoryModel } from '../../../../api/categories/models/category.model';
import { updateValueAndValidity } from '../../../../shared/utils/form-utils';
import { CategoriesFacadeService } from '../../services/categories-facade.service';
import { CategoryFormComponent } from '../category-form/category-form.component';

@Component({
  selector: 'fpd-edit-category-modal',
  standalone: true,
  imports: [CommonModule, CategoryFormComponent, NzButtonModule, NzModalModule, NzSpinModule],
  templateUrl: './edit-category-modal.component.html',
  styleUrls: ['./edit-category-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCategoryModalComponent {
  @ViewChild('form', { read: CategoryFormComponent, static: true })
  categoryFormComponent!: CategoryFormComponent;

  isLoading$ = new BehaviorSubject<boolean>(false);

  category: CategoryModel;

  constructor(private modalRef: NzModalRef, private categoriesFacadeService: CategoriesFacadeService) {
    this.category = this.modalRef.getConfig().nzData;
  }

  onSubmit(): void {
    if (this.categoryFormComponent.formGroup.valid) {
      this.isLoading$.next(true);

      this.categoriesFacadeService.updateCategory$(this.categoryFormComponent.getUpdatedModel()).subscribe(() => {
        this.isLoading$.next(false);

        this.modalRef.destroy(true);
      });
    } else {
      updateValueAndValidity(this.categoryFormComponent.formGroup.controls);
    }
  }

  onDestroyModal(): void {
    this.modalRef.destroy();
  }
}
