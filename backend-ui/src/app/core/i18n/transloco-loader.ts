import { Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { from, Observable } from 'rxjs';
import { Lang } from './i18n.config';

/**
 * Translations are bundled as lazy, hashed chunks (one per language) instead of
 * being fetched from /i18n/*.json – no extra HTTP route needed and they are cached like code.
 * The import paths must stay literal so the bundler can find them.
 */
const translations: Record<Lang, () => Promise<Translation>> = {
  de: () => import('../../../i18n/de.json').then((m) => m.default),
  nl: () => import('../../../i18n/nl.json').then((m) => m.default),
};

@Injectable({ providedIn: 'root' })
export class TranslocoBundleLoader implements TranslocoLoader {
  getTranslation(lang: string): Observable<Translation> {
    return from(translations[lang as Lang]());
  }
}
