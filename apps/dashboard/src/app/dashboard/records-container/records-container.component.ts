import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';

import { RecordModel } from '../../api/records/models/record.model';
import { CurrencyEnum } from '../../shared/enums/currency.enum';
import { AddRecordModalComponent } from './components/add-record-modal/add-record-modal.component';
import { EditRecordModalComponent } from './components/edit-record-modal/edit-record-modal.component';
import { RecordsFacadeService } from './services/records-facade.service';
import { take } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'fpd-records-container',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzModalModule, NzButtonModule, NzPopconfirmModule, NzMessageModule],
  templateUrl: './records-container.component.html',
  styleUrls: ['./records-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordsContainerComponent implements OnInit {
  records$ = this.recordsFacadeService.records$;

  isLoading$ = this.recordsFacadeService.isLoading$;

  pagination$ = this.recordsFacadeService.pagination$;

  CurrencyEnum = CurrencyEnum;

  constructor(
    private recordsFacadeService: RecordsFacadeService,
    private modalService: NzModalService,
    private messageService: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe(({ page, size }) => {
      if (!page) {
        this.changeRouteQueryParams({ page: 1, size: 20 }, true);
      } else {
        page = Number(page ?? 1);
        size = Number(size ?? 20);

        this.recordsFacadeService.updatePagination({
          pageIndex: page,
          pageSize: size,
        });

        this.recordsFacadeService.getRecords();
      }
    });

    this.pagination$.pipe(untilDestroyed(this)).subscribe((v) => {
      this.router.navigate(['./'], {
        queryParams: { page: v.pageIndex, size: v.pageSize },
        relativeTo: this.activatedRoute,
        replaceUrl: false,
      });
    });
  }

  onAddRecord(): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Add new record',
      nzContent: AddRecordModalComponent,
      nzCentered: true,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.recordsFacadeService.getRecords();

        this.messageService.success('Record item was created');
      }
    });
  }

  onEditRecord(record: RecordModel): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Edit record',
      nzContent: EditRecordModalComponent,
      nzCentered: true,
      nzData: record,
    });

    modalRef.afterClose.subscribe((created: boolean) => {
      if (created) {
        this.recordsFacadeService.getRecords();

        this.messageService.success('Record item was updated');
      }
    });
  }

  onDeleteRecord(record: RecordModel): void {
    this.recordsFacadeService.deleteRecord$(record.id).subscribe(() => {
      this.recordsFacadeService.getRecords();

      this.messageService.success('Record item was deleted');
    });
  }

  onPageIndexChanged(pageIndex: number): void {
    this.activatedRoute.queryParams.pipe(take(1)).subscribe((queryParams) => {
      this.changeRouteQueryParams({
        ...queryParams,
        page: pageIndex,
      });
    });
  }

  private changeRouteQueryParams(queryParams: Params, replaceUrl = false): void {
    this.router.navigate(['./'], {
      queryParams,
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
      replaceUrl,
    });
  }
}
