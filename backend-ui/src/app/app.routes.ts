import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guards';

// `title` values are translation keys – see core/i18n/translated-title.strategy.ts
//
// Both layouts use `path: ''`. Order matters: the router takes the first route that matches,
// so the logged-in shell comes first and its Home child only matches the exact URL "/"
// (pathMatch: 'full'). "/login" and "/register" don't match it and fall through to the auth layout.
export const routes: Routes = [
  {
    // Logged-in pages
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'titles.home',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
      },
    ],
  },
  {
    // Logged-out pages
    path: '',
    canActivate: [guestGuard],
    loadComponent: () => import('./layout/auth-layout/auth-layout').then((m) => m.AuthLayout),
    children: [
      {
        path: 'login',
        title: 'titles.login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        title: 'titles.register',
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
