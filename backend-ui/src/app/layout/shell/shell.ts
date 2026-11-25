import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthStore } from '../../core/auth/auth.store';

/** Layout for authenticated pages: top toolbar with user menu + routed content. */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <mat-toolbar>
      <a routerLink="/" class="brand">Backend UI</a>
      <span class="spacer"></span>
      <button mat-button [matMenuTriggerFor]="userMenu">
        <mat-icon>account_circle</mat-icon>
        <span class="email">{{ store.user()?.email }}</span>
      </button>
      <mat-menu #userMenu="matMenu" xPosition="before">
        <button mat-menu-item (click)="store.logout()" [disabled]="store.loading()">
          <mat-icon>logout</mat-icon>
          <span>Logout</span>
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
