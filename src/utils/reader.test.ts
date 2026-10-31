import { afterEach, describe, expect, it, vi } from 'vitest';
import type { VocabularyData } from '../data/vocabulary.types';
import { readerGloss } from '../i18n/lang';
import vocabJson from '../../public/data/vocabulary.json';
import {
  buildIndex,
  describe as describeHits,
  firstSense,
  lookup,
  tokenise,
  translateWord,
} from './reader';

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

describe('firstSense', () => {
  it('keeps the first sense of a dictionary entry', () => {
    expect(firstSense('собака, пёс.')).toBe('собака, пёс');
    expect(firstSense('1) книга; 2) грамота; ном заалгаха обучаться грамоте.')).toBe('книга');
    expect(firstSense('1. 1) спокойный, благополучный; 2) лёгкий')).toBe(
      'спокойный, благополучный'
    );
    expect(firstSense('1 1) здоровье; 2) приветствие')).toBe('здоровье');
  });
});

describe('translateWord', () => {
  afterEach(() => vi.unstubAllGlobals());

  // Answers by service; a word Burlang doesn't have is a 404, as on the real API.
  function services({ burlang, google }: { burlang?: string; google?: string }) {
    return vi.fn((url: string) => {
      const answer = url.includes('burlang.ru') ? burlang : google;
      if (answer === undefined) return Promise.resolve({ ok: false, status: 404 });
      const body = url.includes('burlang.ru')
        ? { translations: [{ value: answer }] }
        : [[[answer, 'x']]];
      return Promise.resolve({ ok: true, json: () => Promise.resolve(body) });
    });
  }

  it('asks Burlang first and shows its Russian as is', async () => {
    const fetchMock = services({ burlang: '1) обеспечивать; 2) удовлетворять', google: 'x' });
    vi.stubGlobal('fetch', fetchMock);
    expect(await translateWord('бурлангру', 'ru')).toEqual({
      text: 'обеспечивать',
      source: 'burlang',
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain('burlang.ru/api/v1/buryat-word/translate?q=');
  });

  it("puts Burlang's Russian into English, and says so", async () => {
    const fetchMock = services({ burlang: 'собака', google: 'dog' });
    vi.stubGlobal('fetch', fetchMock);
    expect(await translateWord('бурлангэн', 'en')).toEqual({
      text: 'dog',
      source: 'burlangMachine',
    });
    expect(fetchMock.mock.calls[1][0]).toContain('sl=ru&tl=en');
  });

  it('keeps the Russian gloss when it cannot be put into English', async () => {
    vi.stubGlobal('fetch', services({ burlang: 'собака' }));
    expect(await translateWord('бурлангтолько', 'en')).toEqual({
      text: 'собака',
      source: 'burlang',
    });
  });

  it('falls back to machine translation and remembers the answer', async () => {
    const fetchMock = services({ google: 'software' });
    vi.stubGlobal('fetch', fetchMock);
    const expected = { text: 'software', source: 'machine' };
    expect(await translateWord('хангамжа', 'en')).toEqual(expected);
    expect(await translateWord('хангамжа', 'en')).toEqual(expected);
    expect(fetchMock).toHaveBeenCalledTimes(2); // Burlang, Google, then the cache
    expect(fetchMock.mock.calls[1][0]).toContain('sl=bxr&tl=en');
  });

  it('survives Burlang being unreachable', async () => {
    const google = services({ google: 'word' });
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) =>
        url.includes('burlang.ru') ? Promise.reject(new Error('offline')) : google(url)
      )
    );
    expect((await translateWord('офлайн', 'en'))?.source).toBe('machine');
  });

  it('treats the word handed back unchanged as no translation', async () => {
    vi.stubGlobal('fetch', services({ google: 'ТЕСТЭЭ' }));
    expect(await translateWord('тестээ', 'ru')).toBeNull();
  });

  it('retries after a failure', async () => {
    vi.stubGlobal('fetch', services({}));
    expect(await translateWord('алдаа', 'en')).toBeNull();
    vi.stubGlobal('fetch', services({ google: 'error' }));
    expect((await translateWord('алдаа', 'en'))?.text).toBe('error');
  });
});
