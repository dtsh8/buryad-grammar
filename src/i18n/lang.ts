import type { Lexeme } from '../data/vocabulary.types';

// Interface languages. Codes are the HTML lang values: Buryad is ISO 639-3 bua,
// the code the app already puts on Buryad text.
export type Lang = 'bua' | 'en' | 'ru';

export const LANGS: ReadonlyArray<{ id: Lang; short: string; name: string }> = [
  { id: 'bua', short: 'БУР', name: 'Буряад' },
  { id: 'en', short: 'EN', name: 'English' },
  { id: 'ru', short: 'РУС', name: 'Русский' },
];

const KEY = 'buryad:ui-lang';

function isLang(v: unknown): v is Lang {
  return LANGS.some(l => l.id === v);
}

// First visit: the browser's preferred languages pick the interface, English otherwise.
export function detectLang(preferred: ReadonlyArray<string>): Lang {
  for (const tag of preferred) {
    const base = tag.toLowerCase().split('-')[0];
    if (base === 'bua' || base === 'bxr') return 'bua';
    if (base === 'ru') return 'ru';
    if (base === 'en') return 'en';
  }
  return 'en';
}

// Storage can be unavailable (private mode, blocked site data), so every access is guarded.
export function loadLang(): Lang {
  try {
    const v = localStorage.getItem(KEY);
    if (isLang(v)) return v;
  } catch {
    // fall through to the browser's languages
  }
  return detectLang(typeof navigator === 'undefined' ? [] : navigator.languages);
}

export function saveLang(lang: Lang): void {
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    // not remembered; the next visit detects again
  }
}

// The translation shown next to a Buryad word. The vocabulary has English and Russian glosses;
// Buryad readers get the Russian one, the language they share with the sources.
export function gloss(l: Pick<Lexeme, 'english' | 'russian'>, lang: Lang): string {
  return lang === 'en' ? l.english : (l.russian ?? l.english);
}

// The translation the Reader shows: Russian for a Russian interface, English otherwise.
export function readerGloss(l: Pick<Lexeme, 'english' | 'russian'>, lang: Lang): string {
  return lang === 'ru' ? (l.russian ?? l.english) : l.english;
}

// Russian noun form for a count: 1 запись, 2 записи, 5 записей.
export function ruPlural(n: number, [one, few, many]: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
