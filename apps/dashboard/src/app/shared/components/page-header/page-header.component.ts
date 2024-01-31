import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { PageHeaderActionInterface } from './interfaces/page-header-action.interface';

@Component({
  selector: 'fpd-page-header',
  standalone: true,
  imports: [NzButtonModule, NzBreadCrumbModule],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  @Input()
  title = '';

  @Input()
  actions: PageHeaderActionInterface[] = [];
}
