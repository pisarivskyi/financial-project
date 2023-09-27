import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { updateValueAndValidity } from '../../../../shared/utils/form-utils';
import { CategoriesFacadeService } from '../../services/categories-facade.service';
import { CategoryFormComponent } from '../category-form/category-form.component';

@Component({
  selector: 'fpd-add-category-modal',
  standalone: true,
  imports: [CommonModule, CategoryFormComponent, NzButtonModule, NzModalModule, NzSpinModule],
  templateUrl: './add-category-modal.component.html',
  styleUrls: ['./add-category-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCategoryModalComponent {
  @ViewChild('form', { read: CategoryFormComponent, static: true })
  categoryFormComponent!: CategoryFormComponent;

  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(private modalRef: NzModalRef, private categoriesFacadeService: CategoriesFacadeService) {}

  onSubmit(): void {
    if (this.categoryFormComponent.formGroup.valid) {
      this.isLoading$.next(true);

      this.categoriesFacadeService.saveCategory$(this.categoryFormComponent.getUpdatedModel()).subscribe(() => {
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
