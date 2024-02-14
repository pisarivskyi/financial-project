import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { UserProfileInterface } from '@financial-project/common';

@Component({
  selector: 'fpd-header',
  standalone: true,
  imports: [NzAvatarModule, NzDropDownModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input()
  user: UserProfileInterface | null | undefined = null;

  @Output()
  logout = new EventEmitter<void>();
}
