import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '@auth0/auth0-angular';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

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
  user: User | null | undefined = null;

  @Output()
  logout = new EventEmitter<void>();
}
