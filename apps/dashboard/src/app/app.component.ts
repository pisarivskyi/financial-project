import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NzIconService } from 'ng-zorro-antd/icon';

import { CATEGORY_ICON_DEFINITIONS } from './shared/constants/category-icon-definitions.const';
import { ICON_DEFINITIONS } from './shared/constants/icon-definitions.const';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'fpd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(iconService: NzIconService) {
    iconService.addIcon(...ICON_DEFINITIONS);
    iconService.addIcon(...CATEGORY_ICON_DEFINITIONS);
  }
}
