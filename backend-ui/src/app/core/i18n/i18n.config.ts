export const LANGUAGES = [
  // label: native name (used for screen readers and the tooltip)
  // flag: horizontal stripes, top to bottom
  { code: 'de', label: 'Deutsch', flag: ['#000000', '#DD0000', '#FFCE00'] },
  { code: 'nl', label: 'Nederlands', flag: ['#AE1C28', '#FFFFFF', '#21468B'] },
] as const;

export type Language = (typeof LANGUAGES)[number];
export type Lang = Language['code'];

export const AVAILABLE_LANGS: Lang[] = LANGUAGES.map((l) => l.code);
export const DEFAULT_LANG: Lang = 'de';

export function isLang(value: unknown): value is Lang {
  return AVAILABLE_LANGS.includes(value as Lang);
}
