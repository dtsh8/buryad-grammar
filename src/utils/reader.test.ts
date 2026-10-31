import { afterEach, describe, expect, it, vi } from 'vitest';
import type { VocabularyData } from '../data/vocabulary.types';
import { readerGloss } from '../i18n/lang';
import vocabJson from '../../public/data/vocabulary.json';
import { buildIndex, describe as describeHits, lookup, tokenise, translateWord } from './reader';

const index = buildIndex((vocabJson as VocabularyData).entries);

function gloss(word: string, lang: 'bua' | 'en' | 'ru' = 'en'): string {
  const [token] = tokenise(word, index);
  return describeHits(token.key ?? '', lookup(token.key ?? '', index), lang);
}

describe('tokenise', () => {
  it('keeps every character of the text', () => {
    const text = 'Амар мэндэ, би\n\nТамир (гэжэ)!';
    expect(
      tokenise(text, index)
        .map(t => t.text)
        .join('')
    ).toBe(text);
  });

  it('takes a vocabulary phrase as one token', () => {
    const words = tokenise('Амар мэндэ, би', index).filter(t => t.key);
    expect(words.map(t => t.text)).toEqual(['Амар мэндэ', 'би']);
  });

  it('does not join a phrase across a comma or a line break', () => {
    expect(tokenise('амар, мэндэ', index).filter(t => t.key)).toHaveLength(2);
    expect(tokenise('амар\nмэндэ', index).filter(t => t.key)).toHaveLength(2);
  });
});

describe('lookup', () => {
  // Evidence for the headwords: docs/verification-questions.md, "Reader vocabulary".
  const GOLD: Array<[string, string]> = [
    ['Амар мэндэ', 'Hello / Greetings'],
    ['би', 'I'],
    ['гэжэ', 'to say so / to call (гэхэ)'],
    ['нэрэтэйб', 'named / called (нэрэтэй)'],
    ['зохёогшоор', 'author / creator (зохёогшо)'],
    ['хүдэлнэб', 'to work (хүдэлхэ)'],
    ['удангүй', 'soon'],
    ['намайе', 'me'],
    ['һэлгэхэ', 'to change / to replace'],
    ['тиимэһээ', 'therefore'],
    ['минии', 'my'],
    ['олоһон', 'to find / to obtain (олохо)'],
    ['бүхы', 'all / whole'],
    ['дүршэл', 'experience / skill'],
    ['хэрэггүй', 'unnecessary / useless'],
  ];

  it.each(GOLD)('%s', (word, expected) => {
    expect(gloss(word)).toBe(expected);
  });

  it('ignores case and the ѳ spelling of ө', () => {
    expect(gloss('НАМАЙЕ')).toBe('me');
    expect(gloss('хүлѳѳнэб')).toBe(gloss('хүлөөнэб'));
  });

  it('leaves words outside the vocabulary empty', () => {
    expect(gloss('хангамжа')).toBe('');
  });
});

describe('readerGloss', () => {
  const l = { english: 'to work', russian: 'работать' };

  it('follows the interface language, with English for Buryad', () => {
    expect(readerGloss(l, 'en')).toBe('to work');
    expect(readerGloss(l, 'ru')).toBe('работать');
    expect(readerGloss(l, 'bua')).toBe('to work');
  });

  it('falls back to English when there is no Russian gloss', () => {
    expect(readerGloss({ english: 'to work' }, 'ru')).toBe('to work');
  });

  it('reaches the text shown for a word', () => {
    expect(gloss('хүдэлнэб', 'ru')).toBe('работать (хүдэлхэ)');
    expect(gloss('хүдэлнэб', 'bua')).toBe('to work (хүдэлхэ)');
  });
});

describe('translateWord', () => {
  afterEach(() => vi.unstubAllGlobals());

  const respond = (translated: string) =>
    vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([[[translated, 'x']]]) });

  it('asks for Buryad to the target language and remembers the answer', async () => {
    const fetchMock = respond('software');
    vi.stubGlobal('fetch', fetchMock);
    expect(await translateWord('хангамжа', 'en')).toBe('software');
    expect(await translateWord('хангамжа', 'en')).toBe('software');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain('sl=bxr&tl=en');
  });

  it('treats the word handed back unchanged as no translation', async () => {
    vi.stubGlobal('fetch', respond('ТЕСТЭЭ'));
    expect(await translateWord('тестээ', 'ru')).toBeNull();
  });

  it('retries after a failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 429 }));
    expect(await translateWord('алдаа', 'en')).toBeNull();
    vi.stubGlobal('fetch', respond('error'));
    expect(await translateWord('алдаа', 'en')).toBe('error');
  });
});
