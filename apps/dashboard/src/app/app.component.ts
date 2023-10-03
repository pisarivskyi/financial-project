import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NzIconService } from 'ng-zorro-antd/icon';

import { ICON_DEFINITIONS } from './shared/constants/icon-definitions.const';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'fpd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(iconService: NzIconService) {
    iconService.addIcon(...ICON_DEFINITIONS);
  }
}
