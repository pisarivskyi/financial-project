import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NzMenuModule } from 'ng-zorro-antd/menu';

import { RoutePathEnum } from '../../../core/enums/route-path.enum';

@Component({
  selector: 'fpd-app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, NzMenuModule],
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppMenuComponent {
  RoutePathEnum = RoutePathEnum;
}
