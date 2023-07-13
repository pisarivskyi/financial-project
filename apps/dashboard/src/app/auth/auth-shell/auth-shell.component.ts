import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'fpd-auth-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './auth-shell.component.html',
  styleUrls: ['./auth-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthShellComponent {}
