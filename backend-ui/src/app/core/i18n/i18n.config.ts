export const LANGUAGES = [
  // Native names: users look for their own language as they write it
  { code: 'de', label: 'Deutsch' },
  { code: 'nl', label: 'Nederlands' },
] as const;

export type Lang = (typeof LANGUAGES)[number]['code'];

export const AVAILABLE_LANGS: Lang[] = LANGUAGES.map((l) => l.code);
export const DEFAULT_LANG: Lang = 'de';

export function isLang(value: unknown): value is Lang {
  return AVAILABLE_LANGS.includes(value as Lang);
}
