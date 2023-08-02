import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { BehaviorSubject, of, switchMap, take } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { Category } from '../../../../api/categories/models/category.model';
import { AuthenticationService } from '../../../../core/authentication/services/authentication.service';
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

  constructor(
    private modalRef: NzModalRef,
    private authService: AuthenticationService,
    private categoriesFacadeService: CategoriesFacadeService
  ) {}

  onSubmit(): void {
    if (this.categoryFormComponent.formGroup.valid) {
      this.isLoading$.next(true);

      this.authService
        .getCurrentUser$()
        .pipe(
          take(1),
          switchMap((currentUser) => {
            if (currentUser) {
              return this.categoriesFacadeService.saveCategory$(
                Category.toInsertData({
                  createdBy: currentUser.id,
                  ...this.categoryFormComponent.formGroup.value,
                })
              );
            }

            return of(null);
          })
        )
        .subscribe(() => {
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
