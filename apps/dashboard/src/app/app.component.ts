import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NzSpinModule } from 'ng-zorro-antd/spin';

import { AppMenuComponent } from './shared/components/app-menu/app-menu.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, AppMenuComponent, NzSpinModule],
  selector: 'fpd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
