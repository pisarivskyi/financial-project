import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { forkJoin } from 'rxjs';

import { NzSpinModule } from 'ng-zorro-antd/spin';

import { AuthenticationService } from '../../core/authentication/services/authentication.service';
import { CurrencyRatesService } from '../services/currency-rates.service';
import { SettingsService } from '../services/settings.service';
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
export class ShellComponent implements OnInit {
  isLoading = signal(true);
  authenticationService = inject(AuthenticationService);
  settingsService = inject(SettingsService);
  currencyRatesService = inject(CurrencyRatesService);

  user$ = this.authenticationService.getProfile$();

  ngOnInit(): void {
    forkJoin([this.settingsService.getSettings$(), this.currencyRatesService.getCurrencyRates$()]).subscribe(() =>
      this.isLoading.set(false),
    );
  }

  onLogOut(): void {
    this.authenticationService.logout$().subscribe();
  }
}
