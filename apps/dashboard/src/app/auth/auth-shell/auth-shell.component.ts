import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'fpd-auth-shell',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './auth-shell.component.html',
  styleUrls: ['./auth-shell.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthShellComponent {}
