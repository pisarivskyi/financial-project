import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { AccountsFacadeService } from '../../services/accounts-facade.service';

@Component({
  selector: 'fpd-add-account-modal',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzModalModule, NzSpinModule],
  templateUrl: './add-account-modal.component.html',
  styleUrls: ['./add-account-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAccountModalComponent {
  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(private modalRef: NzModalRef, private accountsFacadeService: AccountsFacadeService) {}

  onDestroyModal(): void {
    this.modalRef.destroy();
  }
}
