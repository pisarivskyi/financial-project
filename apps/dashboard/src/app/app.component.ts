import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, catchError, finalize, of, switchMap, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

import { AuthenticationService } from './core/authentication/services/authentication.service';
import { RoutePathEnum } from './core/enums/route-path.enum';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'fpd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  isLoading$ = new BehaviorSubject<boolean>(true);

  RoutePathEnum = RoutePathEnum;

  constructor(private router: Router, private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.initSession();
  }

  initSession(): void {
    this.authService.getSession()
      .pipe(
        switchMap((session) => {
          if (!session) {
            this.router.navigate([RoutePathEnum.Auth, RoutePathEnum.SignIn]);

            return of(null);
          } else {
            return this.authService.refreshSession(session);
          }
        }),
        catchError((error) => {
          this.router.navigate([RoutePathEnum.Auth, RoutePathEnum.SignIn])

          return throwError(error);
        }),
        finalize(() => this.isLoading$.next(false))
      )
      .subscribe();
  }
}
