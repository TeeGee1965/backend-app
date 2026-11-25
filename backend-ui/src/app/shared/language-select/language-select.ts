import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';
import { LANGUAGES } from '../../core/i18n/i18n.config';
import { LanguageStore } from '../../core/i18n/language.store';
import { Flag } from '../flag/flag';

/** Material dropdown to switch the UI language, shown as small flags. */
@Component({
  selector: 'app-language-select',
  imports: [MatFormFieldModule, MatSelectModule, TranslocoPipe, Flag],
  template: `
    <mat-form-field appearance="outline" subscriptSizing="dynamic">
      <mat-select
        [value]="store.lang()"
        (selectionChange)="store.setLang($event.value)"
        [aria-label]="'language.label' | transloco"
        [title]="current().label"
        panelWidth=""
      >
        <!-- What the closed dropdown shows: just the flag -->
        <mat-select-trigger>
          <app-flag [stripes]="current().flag" />
          <span class="sr-only">{{ current().label }}</span>
        </mat-select-trigger>

        @for (language of store.languages; track language.code) {
          <mat-option [value]="language.code" [attr.lang]="language.code" [title]="language.label">
            <app-flag [stripes]="language.flag" />
            <span class="sr-only">{{ language.label }}</span>
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
  protected readonly current = computed(
    () => LANGUAGES.find((l) => l.code === this.store.lang()) ?? LANGUAGES[0],
  );
}
