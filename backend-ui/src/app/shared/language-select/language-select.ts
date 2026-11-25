import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';
import { LanguageStore } from '../../core/i18n/language.store';

/** Material dropdown to switch the UI language. */
@Component({
  selector: 'app-language-select',
  imports: [MatFormFieldModule, MatSelectModule, MatIconModule, TranslocoPipe],
  template: `
    <mat-form-field appearance="outline" subscriptSizing="dynamic">
      <mat-icon matPrefix>language</mat-icon>
      <mat-select
        [value]="store.lang()"
        (selectionChange)="store.setLang($event.value)"
        [aria-label]="'language.label' | transloco"
        panelWidth=""
      >
        @for (language of store.languages; track language.code) {
          <mat-option [value]="language.code" [attr.lang]="language.code">
            {{ language.label }}
          </mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
  styleUrl: './language-select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelect {
  protected readonly store = inject(LanguageStore);
}
