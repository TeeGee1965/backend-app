import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '../../core/auth/auth.store';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatIconModule],
  template: `
    <mat-card appearance="outlined">
      <mat-card-header>
        <mat-card-title>Welcome</mat-card-title>
        <mat-card-subtitle>You are signed in as {{ store.user()?.email }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p class="construction">
          <mat-icon>construction</mat-icon>
          <span>This page is under construction. More is coming soon.</span>
        </p>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    :host {
      display: block;
      max-width: 960px;
      margin: 0 auto;
      padding: 24px 16px;
    }
    .construction {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--mat-sys-on-surface-variant);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly store = inject(AuthStore);
}
