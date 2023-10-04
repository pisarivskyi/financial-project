import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';

import { RecordTypeEnum } from '@financial-project/common';

import { RecordModel } from '../../api/records/models/record.model';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { IconEnum } from '../../shared/enums/icon.enum';
import { AmountFormatPipe } from '../../shared/pipes/amount-format/amount-format.pipe';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format/currency-format.pipe';
import { EditRecordModalComponent } from './components/edit-record-modal/edit-record-modal.component';
import { RecordsFacadeService } from './services/records-facade.service';

@UntilDestroy()
@Component({
  selector: 'fpd-records-container',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzModalModule,
    NzButtonModule,
    NzPopconfirmModule,
    NzMessageModule,
    NzIconModule,
    AmountFormatPipe,
    CurrencyFormatPipe,
    PageHeaderComponent,
  ],
  templateUrl: './records-container.component.html',
  styleUrls: ['./records-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordsContainerComponent implements OnInit {
  records$ = this.recordsFacadeService.records$;

  isLoading$ = this.recordsFacadeService.isLoading$;

  pagination$ = this.recordsFacadeService.pagination$;

  readonly IconEnum = IconEnum;

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

        this.recordsFacadeService.updatePagination(page, size);

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

  protected readonly RecordTypeEnum = RecordTypeEnum;
}
