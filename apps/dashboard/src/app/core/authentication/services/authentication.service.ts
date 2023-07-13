import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, from, map, Observable, tap } from 'rxjs';
import { Session } from '@supabase/supabase-js';

import { SupabaseService } from '../../supabase/services/supabase.service';
import { UserModel } from '../models/user.model';
import { RoutePathEnum } from '../../enums/route-path.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private isLoadingSubject$ = new BehaviorSubject<boolean>(true);

  private currentUser$ = new BehaviorSubject<UserModel | undefined | null>(undefined);

  isLoading$ = this.isLoadingSubject$.asObservable();

  constructor(private supabaseService: SupabaseService) { }

  getCurrentUser$(): Observable<UserModel | undefined | null> {
    return this.currentUser$.asObservable();
  }

  getSession$(): Observable<Session | null> {
    this.isLoadingSubject$.next(true);

    return from(
      this.supabaseService.getClient().auth.getSession()
    )
      .pipe(
        tap(({ data }) => {
          if (data?.session?.user) {
            this.currentUser$.next(new UserModel(data?.session?.user))
          } else {
            this.currentUser$.next(null)
          }
        }),
        map(({ data }) => data.session),
        finalize(() => this.isLoadingSubject$.next(false))
      );
  }

  refreshSession$(session: Session): Observable<Session | null> {
    return from(
      this.supabaseService.getClient().auth.refreshSession()
    )
      .pipe(
        tap(({ data }) => {
          if (data?.session?.user) {
            this.currentUser$.next(new UserModel(data?.session?.user))
          }
        }),
        map(({ data }) => data.session),
      );
  }

  signIn$(credentials: { email: string; password: string; }): Observable<any> {
    return from(
      this.supabaseService.getClient().auth.signInWithPassword(credentials)
    )
      .pipe(
        tap(({ data }) => {
          if (data?.user) {
            this.currentUser$.next(new UserModel(data?.user))
          }
        }),
        map(({ data }) => data),
      );
  }

  signOut$(): Observable<any> {
    return from(
      this.supabaseService.getClient().auth.signOut()
    );
  }

  requestPasswordReset$(email: string): Observable<any> {
    return from(
      this.supabaseService.getClient().auth.resetPasswordForEmail(email, {
        redirectTo: `http://localhost:4200/${RoutePathEnum.Dashboard}`
        // redirectTo: `http://localhost:4200/${RoutePathEnum.Auth}/${RoutePathEnum.Password}/${RoutePathEnum.SetPassword}`
      })
    );
  }
}
