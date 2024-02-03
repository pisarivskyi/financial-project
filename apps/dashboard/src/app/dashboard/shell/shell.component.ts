import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NzSpinModule } from 'ng-zorro-antd/spin';

import { AuthenticationService } from '../../core/authentication/services/authentication.service';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'fpd-dashboard-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, NzSpinModule],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  authenticationService = inject(AuthenticationService);

  user$ = this.authenticationService.getProfile$();

  onLogOut(): void {
    this.authenticationService.logout$().subscribe();
  }
}
