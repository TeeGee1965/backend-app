import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, TitleStrategy, withComponentInputBinding } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { AuthStore } from './core/auth/auth.store';
import { AVAILABLE_LANGS, DEFAULT_LANG } from './core/i18n/i18n.config';
import { LanguageStore } from './core/i18n/language.store';
import { TranslatedTitleStrategy } from './core/i18n/translated-title.strategy';
import { TranslocoBundleLoader } from './core/i18n/transloco-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: TitleStrategy, useClass: TranslatedTitleStrategy },
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideTransloco({
      config: {
        availableLangs: AVAILABLE_LANGS,
        defaultLang: DEFAULT_LANG,
        fallbackLang: DEFAULT_LANG,
        missingHandler: { useFallbackTranslation: true },
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoBundleLoader,
    }),
    // Both run before the first navigation (in parallel):
    // load the active language, and ask the backend who is logged in.
    provideAppInitializer(() => inject(LanguageStore).init()),
    provideAppInitializer(() => inject(AuthStore).loadSession()),
  ],
};
