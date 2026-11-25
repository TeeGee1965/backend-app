import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, firstValueFrom, pipe, tap } from 'rxjs';
import { AuthApi } from './auth.api';
import { AuthUser, LoginRequest, RegisterRequest } from './auth.models';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

/**
 * Maps a failed auth request to a translation key (see src/i18n/*.json).
 * The backend's own messages are English, so the UI picks its text by HTTP status instead.
 */
function toErrorKey(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    // 0 = no connection at all; 502/503/504 = the dev proxy (or a gateway) can't reach the backend
    if ([0, 502, 503, 504].includes(err.status)) return 'errors.unreachable';
    if (err.status === 401) return 'errors.invalidCredentials'; // login: wrong email/password
    if (err.status === 409) return 'errors.emailTaken'; // register: email already used
    if (err.status === 400) return 'errors.invalidInput'; // Zod validation failed
  }
  return 'errors.generic';
}

/**
 * The JWT lives in an httpOnly cookie that JavaScript cannot read, so the backend is the
 * source of truth: `loadSession()` asks GET /auth/me who is logged in (run once at startup).
 */
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ user }) => ({
    isAuthenticated: computed(() => user() !== null),
  })),
  withMethods((store, api = inject(AuthApi), router = inject(Router)) => {
    const clearSession = (): void => {
      patchState(store, { user: null, loading: false, error: null });
    };

    /** Shared result handling for login and register: both end with a logged-in user. */
    const signedIn = (returnUrl?: string) => ({
      next: ({ data }: { data: AuthUser }) => {
        patchState(store, { user: data, loading: false });
        void router.navigateByUrl(returnUrl || '/');
      },
      error: (err: unknown) => patchState(store, { loading: false, error: toErrorKey(err) }),
    });

    return {
      /** Restores the session from the cookie. Never rejects: any failure means "logged out". */
      async loadSession(): Promise<void> {
        try {
          const { data } = await firstValueFrom(api.me());
          patchState(store, { user: data });
        } catch {
          clearSession();
        }
      },

      login: rxMethod<{ credentials: LoginRequest; returnUrl?: string }>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          exhaustMap(({ credentials, returnUrl }) =>
            api.login(credentials).pipe(tapResponse(signedIn(returnUrl))),
          ),
        ),
      ),

      /** Creates the account; the backend logs the new user in right away. */
      register: rxMethod<{ data: RegisterRequest; returnUrl?: string }>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          exhaustMap(({ data, returnUrl }) =>
            api.register(data).pipe(tapResponse(signedIn(returnUrl))),
          ),
        ),
      ),

      logout: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          exhaustMap(() =>
            api.logout().pipe(
              tapResponse({
                // Clear the local session even if the request fails – the user wants out.
                next: () => undefined,
                error: () => undefined,
                finalize: () => {
                  clearSession();
                  void router.navigateByUrl('/login');
                },
              }),
            ),
          ),
        ),
      ),

      /** Drop the local session without calling the backend (e.g. after a 401). */
      clearSession,

      clearError(): void {
        patchState(store, { error: null });
      },
    };
  }),
);
