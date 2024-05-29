import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  IBackendSuccess,
  ILoginRequest,
  IRegisterRequest,
  IUser,
} from '@app/models';
import { StorageService } from '@app/shared';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subject, concatMap, mergeMap, tap } from 'rxjs';

const AUTH_URL = environment.server_url + '/auth';

interface IUserState {
  user: IUser | null | unknown;
  error: string;
  loggedIn: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // urls
  private login_url = `${AUTH_URL}/signin`;
  private logout_url = `${AUTH_URL}/signout`;
  private register_url = `${AUTH_URL}/signup`;
  // state
  private userState = signal<IUserState>({
    error: '',
    loggedIn: !this.storage.get('token') ? false : true,
    user: this.storage.get('user'),
  });

  // selectors
  user = computed(() => this.userState().user);
  error = computed(() => this.userState().error);
  loggedIn = computed(() => this.userState().loggedIn);

  // actions
  login$ = new Subject<ILoginRequest>();
  register$ = new Subject<IRegisterRequest>();
  logout$ = new Subject();

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private toastr: ToastrService,
    private router: Router
  ) {
    // login
    // The side effects are handled via tap operator instead of the effect function because
    // the effect function was running before the state had any values
    this.login$
      .pipe(
        takeUntilDestroyed(),
        concatMap((user) =>
          this.http
            .post<IUser>(this.login_url, user)
            .pipe(
              tap(
                (data) => (
                  this.storage.set('token', data.token),
                  this.storage.set('user', data)
                )
              )
            )
        )
      )
      .subscribe({
        next: (user) => {
          if (user) {
            this.userState.update((state) => ({
              ...state,
              user,
              loggedIn: true,
            }));

            this.router.navigateByUrl('/dashboard');
          }
        },
        error: (error) => {
          this.userState.update((state) => ({ ...state, error: error.error }));
        },
      });

    // Logout
    this.logout$
      .pipe(
        takeUntilDestroyed(),
        mergeMap(() =>
          this.http
            .post<IBackendSuccess>(this.logout_url, {})
            .pipe(
              tap(
                (_) => (
                  this.storage.remove('token'), this.storage.remove('user')
                )
              )
            )
        )
      )
      .subscribe({
        next: (_) => {
          this.userState.update((state) => ({
            ...state,
            user: null,
            loggedIn: false,
          }));

          this.router.navigateByUrl('/auth/login');
        },
        error: (error) => {
          this.userState.update((state) => ({
            ...state,
            error: error.error,
          }));
        },
      });
  }
}
