import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { ExpanseCategory } from '../../../../api/expanse-categories/models/expanse-category.model';
import { AuthenticationService } from '../../../../core/authentication/services/authentication.service';
import { updateValueAndValidity } from '../../../../shared/utils/form-utils';
import { ExpanseCategoriesFacadeService } from '../../services/expanse-categories-facade.service';
import { ExpanseCategoryFormComponent } from '../expanse-category-form/expanse-category-form.component';

@Component({
  selector: 'fpd-edit-expanse-category-modal',
  standalone: true,
  imports: [CommonModule, ExpanseCategoryFormComponent, NzButtonModule, NzModalModule, NzSpinModule],
  templateUrl: './edit-expanse-category-modal.component.html',
  styleUrls: ['./edit-expanse-category-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditExpanseCategoryModalComponent {
  @ViewChild('form', { read: ExpanseCategoryFormComponent, static: true })
  expanseFormCategoryComponent!: ExpanseCategoryFormComponent;

  isLoading$ = new BehaviorSubject<boolean>(false);

  expanseCategory: ExpanseCategory;

  constructor(
    private modalRef: NzModalRef,
    private authService: AuthenticationService,
    private expanseCategoriesFacadeService: ExpanseCategoriesFacadeService
  ) {
    this.expanseCategory = this.modalRef.getConfig().nzData;
  }

  onSubmit(): void {
    if (this.expanseFormCategoryComponent.formGroup.valid) {
      this.isLoading$.next(true);

      this.expanseCategoriesFacadeService
        .updateExpanseCategory(
          this.expanseCategory.id,
          ExpanseCategory.toUpdateData(this.expanseFormCategoryComponent.formGroup.value)
        )
        .subscribe(() => {
          this.isLoading$.next(false);

          this.modalRef.destroy(true);
        });
    } else {
      updateValueAndValidity(this.expanseFormCategoryComponent.formGroup.controls);
    }
  }

  onDestroyModal(): void {
    this.modalRef.destroy();
  }
}
