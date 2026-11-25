import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  MeResponse,
  RegisterRequest,
  RegisterResponse,
} from './auth.models';

/** Thin HTTP wrapper around the backend-course `/auth` routes. */
@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(API_BASE_URL)}/auth`;

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials, {
      withCredentials: true,
    });
  }

  /** Creates the account and logs the new user in (sets the `jwt` cookie). */
  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, data, {
      withCredentials: true,
    });
  }

  /** Returns the user belonging to the current `jwt` cookie, or fails with 401. */
  me(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.baseUrl}/me`, { withCredentials: true });
  }

  logout(): Observable<LogoutResponse> {
    return this.http.post<LogoutResponse>(`${this.baseUrl}/logout`, {}, { withCredentials: true });
  }
}
