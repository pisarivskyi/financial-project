import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { RoutePathEnum } from '../../../../core/routing/enums/route-path.enum';
import { IconEnum } from '../../../../shared/enums/icon.enum';

@Component({
  selector: 'fpd-sidebar',
  standalone: true,
  imports: [RouterLink, NzMenuModule, NzButtonModule, NzIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  RoutePathEnum = RoutePathEnum;

  readonly IconEnum = IconEnum;
}
