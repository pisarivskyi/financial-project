import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, finalize, forkJoin, map, retry, switchMap, timer } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { AccountModel } from '../../../../../../api/accounts/models/account.model';
import { AccountsFacadeService } from '../../../../services/accounts-facade.service';

@Component({
  selector: 'fpd-setup-initial-synchronization-step',
  standalone: true,
  imports: [CommonModule, NzSpinModule, NzModalModule, NzButtonModule, NzCheckboxModule, FormsModule],
  templateUrl: './setup-initial-synchronization-step.component.html',
  styleUrls: ['./setup-initial-synchronization-step.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupInitialSynchronizationStepComponent implements OnInit {
  @Input({ required: true })
  accounts: AccountModel[] = [];

  isLoading$ = new BehaviorSubject<boolean>(false);

  options: { label: string; value: AccountModel; checked?: boolean }[] = [];

  private accountsFacadeService = inject(AccountsFacadeService);
  private modalRef = inject(NzModalRef);

  ngOnInit(): void {
    this.options = this.accounts.map((account) => ({ label: account.maskedPan, value: account }));
  }

  onNext(): void {
    this.isLoading$.next(true);

    forkJoin(
      this.options
        .filter((option) => option.checked)
        .map(({ value }) => this.accountsFacadeService.triggerSynchronizationForAccount$(value.id))
    )
      .pipe(
        switchMap((jobs) => {
          return forkJoin(jobs.map((job) => this.accountsFacadeService.getSynchronizationJob$(job.id))).pipe(
            map((jobs) => {
              if (!jobs.every((job) => job.finishedOn)) {
                throw new Error();
              }

              return jobs;
            }),
            retry({
              delay: () => timer(5000),
            })
          );
        }),
        finalize(() => this.isLoading$.next(false))
      )
      .subscribe(() => this.modalRef.destroy(true));
  }

  onClose(): void {
    this.modalRef.destroy(true);
  }
}
