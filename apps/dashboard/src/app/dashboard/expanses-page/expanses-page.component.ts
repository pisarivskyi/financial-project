import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';

import { ExpansesFacadeService } from './services/expanses-facade.service';
import { AddExpanseModalComponent } from './components/add-expanse-modal/add-expanse-modal.component';
import { CurrencyEnum } from '../../shared/enums/currency.enum';
import { ExpanseModel } from '../../api/expanses/models/expanse.model';
import { EditExpanseModalComponent } from './components/edit-expanse-modal/edit-expanse-modal.component';

@Component({
  selector: 'fpd-expanses-page',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzModalModule, NzButtonModule, NzPopconfirmModule, NzMessageModule],
  templateUrl: './expanses-page.component.html',
  styleUrls: ['./expanses-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpansesPageComponent implements OnInit {
  expanses$ = this.expansesService.expanses$;

  isLoading$ = this.expansesService.isLoading$;

  CurrencyEnum = CurrencyEnum;

  constructor(private expansesService: ExpansesFacadeService, private modalService: NzModalService, private messageService: NzMessageService) {}

  ngOnInit(): void {
    this.expansesService.getExpanses();
  }

  onAddNewExpanse(): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Add new expanse',
      nzContent: AddExpanseModalComponent,
      nzCentered: true,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.expansesService.getExpanses();

        this.messageService.success('Expanse item was created');
      }
    });
  }

  onEditExpanse(expanse: ExpanseModel): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Edit expanse',
      nzContent: EditExpanseModalComponent,
      nzCentered: true,
      nzData: expanse,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.expansesService.getExpanses();

        this.messageService.success('Expanse item was updated');
      }
    });
  }

  onDeleteExpanse(expanse: ExpanseModel): void {
    this.expansesService.deleteExpanse(expanse.id)
      .subscribe(() => {
        this.expansesService.getExpanses();

        this.messageService.success('Expanse item was deleted')
      });
  }
}
