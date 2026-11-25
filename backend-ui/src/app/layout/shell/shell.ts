import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthStore } from '../../core/auth/auth.store';
import { LanguageSelect } from '../../shared/language-select/language-select';

/** Layout for authenticated pages: top toolbar with language switch + user menu, routed content. */
@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    TranslocoPipe,
    LanguageSelect,
  ],
  template: `
    <mat-toolbar>
      <a routerLink="/" class="brand">{{ 'app.name' | transloco }}</a>
      <span class="spacer"></span>
      <app-language-select />
      <button
        mat-button
        [matMenuTriggerFor]="userMenu"
        [attr.aria-label]="'shell.userMenu' | transloco"
      >
        <mat-icon>account_circle</mat-icon>
        <span class="email">{{ store.user()?.email }}</span>
      </button>
      <mat-menu #userMenu="matMenu" xPosition="before">
        <button mat-menu-item (click)="store.logout()" [disabled]="store.loading()">
          <mat-icon>logout</mat-icon>
          <span>{{ 'shell.logout' | transloco }}</span>
        </button>
      </mat-menu>
    </mat-toolbar>
    <main><router-outlet /></main>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100%;
    }
    mat-toolbar {
      gap: 8px;
      background: var(--mat-sys-surface-container);
    }
    .brand {
      color: inherit;
      text-decoration: none;
    }
    .spacer {
      flex: 1;
    }
    main {
      flex: 1;
    }
    @media (max-width: 480px) {
      .email {
        display: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  protected readonly store = inject(AuthStore);
}
