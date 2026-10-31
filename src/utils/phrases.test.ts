import { describe, expect, it } from 'vitest';
import type { VocabularyData } from '../data/vocabulary.types';
import vocabJson from '../../public/data/vocabulary.json';
import { findPhrases, sentenceOf } from './phrases';
import { buildIndex, tokenise } from './reader';

const index = buildIndex((vocabJson as VocabularyData).entries);

function phrases(text: string): string[] {
  return findPhrases(tokenise(text, index), index).map(p => p.text);
}

describe('findPhrases', () => {
  it('binds a participle to its noun and a predicate to its modal', () => {
    expect(phrases('Хэлэжэ байһан үгэдэ харюусалгатай байха хэрэгтэй.')).toEqual([
      'Хэлэжэ байһан үгэдэ',
      'харюусалгатай байха хэрэгтэй',
    ]);
  });

  it('takes the object of the participle', () => {
    expect(phrases('Тэрэ хэлые үзэжэ байһан хүн ерэбэ.')).toEqual(['хэлые үзэжэ байһан хүн']);
  });

  it('binds an infinitive to a modal without taking the word before it', () => {
    expect(phrases('Би ябаха хэрэгтэй')).toEqual(['ябаха хэрэгтэй']);
    expect(phrases('Намда ябаха хэрэггүй')).toEqual(['ябаха хэрэггүй']);
  });

  it('leaves a participle without a noun after it alone', () => {
    expect(phrases('Би ном уншаһан')).toEqual([]);
    expect(phrases('уншаһан ябаба')).toEqual([]);
  });

  it('stops at punctuation', () => {
    expect(phrases('Хэлэжэ байһан, үгэ')).toEqual([]);
  });

  it('gives token positions that cover the phrase', () => {
    const tokens = tokenise('Би уншаһан ном абаа', index);
    const [phrase] = findPhrases(tokens, index);
    expect(
      tokens
        .slice(phrase.start, phrase.end + 1)
        .map(t => t.text)
        .join('')
    ).toBe('уншаһан ном');
  });
});

describe('sentenceOf', () => {
  it('gives every token its sentence', () => {
    const tokens = tokenise('Би ябанаб. Ши ерэбэш!\nТиимэ', index);
    const sentences = sentenceOf(tokens);
    expect(sentences).toHaveLength(tokens.length);
    expect([...new Set(sentences)].filter(Boolean)).toEqual(['Би ябанаб.', 'Ши ерэбэш!', 'Тиимэ']);
    expect(sentences[tokens.findIndex(t => t.text === 'ерэбэш')]).toBe('Ши ерэбэш!');
  });
});
