import { describe, expect, it } from 'vitest';
import { detectLang, gloss, ruPlural } from './lang';
import { MESSAGES } from './context';

describe('detectLang', () => {
  it('picks the first supported browser language', () => {
    expect(detectLang(['ru-RU', 'en-US'])).toBe('ru');
    expect(detectLang(['de-DE', 'en-GB'])).toBe('en');
    expect(detectLang(['bua'])).toBe('bua');
    expect(detectLang(['bxr-RU', 'ru'])).toBe('bua');
  });

  it('falls back to English', () => {
    expect(detectLang([])).toBe('en');
    expect(detectLang(['fr', 'zh-CN'])).toBe('en');
  });
});

describe('gloss', () => {
  const word = { english: 'book', russian: 'книга' };

  it('uses the Russian gloss for Russian and Buryad readers', () => {
    expect(gloss(word, 'en')).toBe('book');
    expect(gloss(word, 'ru')).toBe('книга');
    expect(gloss(word, 'bua')).toBe('книга');
  });

  it('falls back to English when there is no Russian gloss', () => {
    expect(gloss({ english: 'book' }, 'ru')).toBe('book');
  });
});

describe('ruPlural', () => {
  const forms: [string, string, string] = ['слово', 'слова', 'слов'];

  it.each([
    [1, 'слово'],
    [2, 'слова'],
    [5, 'слов'],
    [11, 'слов'],
    [12, 'слов'],
    [21, 'слово'],
    [104, 'слова'],
    [111, 'слов'],
  ])('%i → %s', (n, form) => {
    expect(ruPlural(n, forms)).toBe(form);
  });
});

// Every string leaf, with its key path, so an empty translation is caught by name.
function leaves(o: unknown, path = ''): Array<[string, unknown]> {
  if (o !== null && typeof o === 'object') {
    return Object.entries(o).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
  }
  return [[path, o]];
}

describe('messages', () => {
  const en = leaves(MESSAGES.en).map(([k]) => k);

  it.each(['ru', 'bua'] as const)('%s has every key of English and no empty strings', lang => {
    const entries = leaves(MESSAGES[lang]);
    expect(entries.map(([k]) => k)).toEqual(en);
    for (const [k, v] of entries) {
      if (typeof v === 'string') expect(v.trim(), k).not.toBe('');
    }
  });
});
