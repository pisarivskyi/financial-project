import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NzMenuModule } from 'ng-zorro-antd/menu';

import { RoutePathEnum } from '../../../../core/enums/route-path.enum';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'fpd-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, NzMenuModule, NzButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  RoutePathEnum = RoutePathEnum;
}
