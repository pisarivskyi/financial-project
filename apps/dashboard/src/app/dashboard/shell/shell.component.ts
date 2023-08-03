import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NzSpinModule } from 'ng-zorro-antd/spin';

import { AppMenuComponent } from '../../shared/components/app-menu/app-menu.component';

@Component({
  selector: 'fpd-dashboard-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppMenuComponent, NzSpinModule],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {}
