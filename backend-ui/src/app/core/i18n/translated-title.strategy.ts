import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { filter } from 'rxjs';

/**
 * Route `title`s are translation keys (e.g. 'titles.login'). This strategy translates
 * them, appends the app name, and updates the browser tab again when the language changes.
 */
@Injectable({ providedIn: 'root' })
export class TranslatedTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly transloco = inject(TranslocoService);
  private titleKey: string | undefined;

  constructor() {
    super();
    // 'langChanged' fires after LanguageStore loaded the translation and switched.
    // (langChanges$ would also emit the default language before anything is loaded,
    // briefly showing the raw key "app.name" in the browser tab.)
    this.transloco.events$
      .pipe(filter((event) => event.type === 'langChanged'))
      .subscribe(() => this.apply());
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.titleKey = this.buildTitle(snapshot);
    this.apply();
  }

  private apply(): void {
    const app = this.transloco.translate('app.name');
    this.title.setTitle(this.titleKey ? `${this.transloco.translate(this.titleKey)} · ${app}` : app);
  }
}
