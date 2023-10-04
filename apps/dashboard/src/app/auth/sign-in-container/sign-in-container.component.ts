import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'fpd-sign-in-container',
  standalone: true,
  imports: [CommonModule, NzButtonModule],
  templateUrl: './sign-in-container.component.html',
  styleUrls: ['./sign-in-container.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInContainerComponent {
  authService = inject(AuthService);

  onLogin(): void {
    this.authService.loginWithRedirect();
  }
}
