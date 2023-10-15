import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { updateValueAndValidity } from '../../../../shared/utils/form-utils';
import { BudgetsFacadeService } from '../../services/budgets-facade.service';
import { BudgetFormComponent } from '../budget-form/budget-form.component';

@Component({
  selector: 'fpd-add-budget-modal',
  standalone: true,
  imports: [CommonModule, BudgetFormComponent, NzButtonModule, NzModalModule, NzSpinModule],
  templateUrl: './add-budget-modal.component.html',
  styleUrls: ['./add-budget-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBudgetModalComponent {
  @ViewChild('form', { read: BudgetFormComponent, static: true })
  budgetFormComponent!: BudgetFormComponent;

  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(private modalRef: NzModalRef, private budgetsFacadeService: BudgetsFacadeService) {}

  onSubmit(): void {
    if (this.budgetFormComponent.formGroup.valid) {
      this.isLoading$.next(true);

      this.budgetsFacadeService.saveBudget$(this.budgetFormComponent.getUpdatedModel()).subscribe(() => {
        this.isLoading$.next(false);

        this.modalRef.destroy(true);
      });
    } else {
      updateValueAndValidity(this.budgetFormComponent.formGroup.controls);
    }
  }

  onDestroyModal(): void {
    this.modalRef.destroy();
  }
}
