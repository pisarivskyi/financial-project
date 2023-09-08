import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

import { NzSpinModule } from 'ng-zorro-antd/spin';

import { HttpMethodEnum } from '../../core/communication/enums/http-method.enum';
import { CommunicationService } from '../../core/communication/services/communication.service';
import { AppMenuComponent } from '../../shared/components/app-menu/app-menu.component';

@Component({
  selector: 'fpd-dashboard-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppMenuComponent, NzSpinModule],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  constructor(private authService: AuthService, private com: CommunicationService) {}

  logout() {
    this.authService.logout({
      // openUrl: false,
    });
  }

  makeRequest(): void {
    this.authService.user$.subscribe((u) => {
      console.log(u);
    });

    this.com
      .makeRequest({
        method: HttpMethodEnum.Get,
        path: '/categories',
      })
      .subscribe((d) => {
        console.log(d);
      });
  }
}
