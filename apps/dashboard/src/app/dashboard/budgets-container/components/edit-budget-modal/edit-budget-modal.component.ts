import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { BudgetModel } from '../../../../api/budgets/models/budget.model';
import { updateValueAndValidity } from '../../../../shared/utils/form-utils';
import { BudgetsFacadeService } from '../../services/budgets-facade.service';
import { BudgetFormComponent } from '../budget-form/budget-form.component';

@Component({
  selector: 'fpd-edit-budget-modal',
  standalone: true,
  imports: [CommonModule, BudgetFormComponent, NzButtonModule, NzModalModule, NzSpinModule],
  templateUrl: './edit-budget-modal.component.html',
  styleUrls: ['./edit-budget-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditBudgetModalComponent {
  @ViewChild('form', { read: BudgetFormComponent, static: true })
  budgetFormComponent!: BudgetFormComponent;

  isLoading$ = new BehaviorSubject<boolean>(false);

  budget: BudgetModel;

  constructor(private modalRef: NzModalRef, private budgetsFacadeService: BudgetsFacadeService) {
    this.budget = this.modalRef.getConfig().nzData;
  }

  onSubmit(): void {
    if (this.budgetFormComponent.formGroup.valid) {
      this.isLoading$.next(true);

      this.budgetsFacadeService.updateBudget$(this.budgetFormComponent.getUpdatedModel()).subscribe(() => {
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
