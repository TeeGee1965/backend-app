import { InjectionToken } from '@angular/core';

/**
 * Base URL of the backend-course API.
 * In development, `/api` is proxied to http://localhost:3001/api (see proxy.conf.json);
 * in production the backend serves this app itself, so `/api` is the same server.
 * Either way the httpOnly `jwt` cookie set by the backend stays same-origin.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '/api',
});
