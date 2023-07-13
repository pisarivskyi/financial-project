import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';

import { ExpanseModel } from '../../api/expanses/models/expanse.model';
import { CurrencyEnum } from '../../shared/enums/currency.enum';
import { AddExpanseModalComponent } from './components/add-expanse-modal/add-expanse-modal.component';
import { EditExpanseModalComponent } from './components/edit-expanse-modal/edit-expanse-modal.component';
import { ExpansesFacadeService } from './services/expanses-facade.service';

@UntilDestroy()
@Component({
  selector: 'fpd-expanses-container',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzModalModule, NzButtonModule, NzPopconfirmModule, NzMessageModule],
  templateUrl: './expanses-container.component.html',
  styleUrls: ['./expanses-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansesContainerComponent implements OnInit {
  expanses$ = this.expansesFacadeService.expanses$;

  isLoading$ = this.expansesFacadeService.isLoading$;

  pagination$ = this.expansesFacadeService.pagination$;

  CurrencyEnum = CurrencyEnum;

  constructor(
    private expansesFacadeService: ExpansesFacadeService,
    private modalService: NzModalService,
    private messageService: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe(({ page, size }) => {
      page = Number(page ?? 1);
      size = Number(size ?? 20);

      this.expansesFacadeService.updatePagination({
        pageIndex: page,
        pageSize: size,
      });

      this.expansesFacadeService.getExpanses();
    });

    this.pagination$.pipe(untilDestroyed(this)).subscribe((v) => {
      this.router.navigate(['./'], {
        queryParams: { page: v.pageIndex, size: v.pageSize },
        relativeTo: this.activatedRoute,
        replaceUrl: false,
      });
    });
  }

  onAddNewExpanse(): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Add new expanse',
      nzContent: AddExpanseModalComponent,
      nzCentered: true,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.expansesFacadeService.getExpanses();

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
        this.expansesFacadeService.getExpanses();

        this.messageService.success('Expanse item was updated');
      }
    });
  }

  onDeleteExpanse(expanse: ExpanseModel): void {
    this.expansesFacadeService.deleteExpanse(expanse.id).subscribe(() => {
      this.expansesFacadeService.getExpanses();

      this.messageService.success('Expanse item was deleted');
    });
  }

  onPageIndexChanged(pageIndex: number): void {
    this.router.navigate(['./'], {
      queryParams: { page: pageIndex },
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
      replaceUrl: false,
    });
  }
}
