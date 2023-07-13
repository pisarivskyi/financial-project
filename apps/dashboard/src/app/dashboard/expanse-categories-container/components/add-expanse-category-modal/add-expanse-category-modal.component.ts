import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { BehaviorSubject, of, switchMap, take } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { ExpanseCategory } from '../../../../api/expanse-categories/models/expanse-category.model';
import { AuthenticationService } from '../../../../core/authentication/services/authentication.service';
import { updateValueAndValidity } from '../../../../shared/utils/form-utils';
import { ExpanseCategoriesFacadeService } from '../../services/expanse-categories-facade.service';
import { ExpanseCategoryFormComponent } from '../expanse-category-form/expanse-category-form.component';

@Component({
  selector: 'fpd-add-expanse-category-modal',
  standalone: true,
  imports: [CommonModule, ExpanseCategoryFormComponent, NzButtonModule, NzModalModule, NzSpinModule],
  templateUrl: './add-expanse-category-modal.component.html',
  styleUrls: ['./add-expanse-category-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddExpanseCategoryModalComponent {
  @ViewChild('form', { read: ExpanseCategoryFormComponent, static: true })
  expanseCategoryFormComponent!: ExpanseCategoryFormComponent;

  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private modalRef: NzModalRef,
    private authService: AuthenticationService,
    private expanseCategoriesFacadeService: ExpanseCategoriesFacadeService
  ) {}

  onSubmit(): void {
    if (this.expanseCategoryFormComponent.formGroup.valid) {
      this.isLoading$.next(true);

      this.authService
        .getCurrentUser$()
        .pipe(
          take(1),
          switchMap((currentUser) => {
            if (currentUser) {
              return this.expanseCategoriesFacadeService.saveExpanseCategory(
                ExpanseCategory.toInsertData({
                  createdBy: currentUser.id,
                  ...this.expanseCategoryFormComponent.formGroup.value,
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
      updateValueAndValidity(this.expanseCategoryFormComponent.formGroup.controls);
    }
  }

  onDestroyModal(): void {
    this.modalRef.destroy();
  }
}
