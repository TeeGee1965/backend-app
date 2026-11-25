import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { DEFAULT_LANG, isLang, Lang, LANGUAGES } from './i18n.config';

const STORAGE_KEY = 'backend-ui.lang';

/** Saved choice → browser language → German. */
function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    /* storage blocked – fall through */
  }
  const browser = (navigator.languages ?? [navigator.language])
    .map((l) => l.slice(0, 2).toLowerCase())
    .find(isLang);
  return browser ?? DEFAULT_LANG;
}

export const LanguageStore = signalStore(
  { providedIn: 'root' },
  withState({ lang: DEFAULT_LANG as Lang }),
  withProps(() => ({ languages: LANGUAGES })),
  withMethods((store, transloco = inject(TranslocoService), document = inject(DOCUMENT)) => {
    /** Loads the translation first, then switches – so no untranslated keys ever flash. */
    const setLang = async (lang: Lang): Promise<void> => {
      await firstValueFrom(transloco.load(lang));
      transloco.setActiveLang(lang);
      document.documentElement.lang = lang; // screen readers, hyphenation, spell check
      patchState(store, { lang });
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        /* storage blocked – the choice just isn't remembered */
      }
    };

    return {
      setLang,
      /** Run once at startup (app initializer). */
      init: () => setLang(initialLang()),
    };
  }),
);
