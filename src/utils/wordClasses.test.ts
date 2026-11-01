import { describe, expect, it } from 'vitest';
import type { VocabularyData } from '../data/vocabulary.types';
import vocabJson from '../../public/data/vocabulary.json';
import classJson from '../../public/data/word-classes.json';
import { buildIndex } from './reader';
import { buildClassIndex, wordLabels, type WordClassData } from './wordClasses';

const { entries } = vocabJson as VocabularyData;
const data = classJson as WordClassData;
const index = buildIndex(entries);
const classes = buildClassIndex(data);
const noVocabulary = buildIndex([]);

describe('word-classes.json', () => {
  it('holds clean, sorted, lower-case words', () => {
    for (const words of [data.noun, data.adjective, data.numeral]) {
      for (const word of words) expect(word).toMatch(/^[а-яёөүһ]+(-[а-яёөүһ]+)*$/);
      expect(new Set(words).size).toBe(words.length);
    }
  });

  it('agrees with the vocabulary on every word they share', () => {
    const checked = entries.filter(l => ['noun', 'adjective', 'numeral'].includes(l.category));
    for (const l of checked) {
      const listed = classes.get(l.buryad.toLowerCase());
      if (listed) expect(listed, l.buryad).toContain(l.category);
    }
  });

  it('lists entries with numbered senses and stems in brackets', () => {
    expect(classes.get('нютаг')).toContain('noun'); // НЮТАГ 1. юум. н.
    expect(classes.get('бага')).toContain('adjective'); // БАГА 1. тэмд. н.
    expect(classes.get('гурбан')).toContain('numeral');
    expect(classes.get('адаһан')).toContain('noun'); // АДАҺА(Н)
    expect(classes.get('адаһа')).toContain('noun');
    expect(classes.get('моригүй')).toContain('adjective'); // printed with a Latin Y
  });
});

describe('wordLabels', () => {
  it('names the case of a vocabulary noun, but not the nominative', () => {
    expect(wordLabels('үгэдэ', index, classes)).toEqual([{ category: 'noun', nounCase: 'dative' }]);
    expect(wordLabels('үгэ', index, classes)).toEqual([{ category: 'noun' }]);
  });

  it('names the form of a vocabulary verb', () => {
    expect(wordLabels('хэлэжэ', index, classes)).toContainEqual({
      category: 'verb',
      kind: 'converb',
    });
    expect(wordLabels('хэлэһэн', index, classes)).toContainEqual({
      category: 'verb',
      kind: 'participle',
    });
    expect(wordLabels('хэлэхэ', index, classes)).toEqual([{ category: 'verb' }]);
  });

  it('uses the dictionary list for words the vocabulary lacks', () => {
    expect(wordLabels('нютаг', noVocabulary, classes)).toContainEqual({ category: 'noun' });
    expect(wordLabels('гурбан', noVocabulary, classes)).toContainEqual({ category: 'numeral' });
  });

  it('finds the case of a dictionary noun', () => {
    expect(wordLabels('нютагта', noVocabulary, classes)).toEqual([
      { category: 'noun', nounCase: 'dative' },
    ]);
    expect(wordLabels('багшаар', noVocabulary, classes)).toEqual([
      { category: 'noun', nounCase: 'instrumental' },
    ]);
  });

  it('marks a verb guessed from a distinctive ending as unsure', () => {
    expect(wordLabels('шэнэлжэ', noVocabulary, new Map())).toContainEqual({
      category: 'verb',
      kind: 'converb',
      unsure: true,
    });
  });

  it('prefers the dictionary to the ending', () => {
    expect(wordLabels('аргамжа', noVocabulary, classes)).toContainEqual({ category: 'noun' });
    expect(wordLabels('аргамжа', noVocabulary, classes)).toHaveLength(1);
  });

  it('gives no label for a shape common outside verbs, until a dictionary confirms the verb', () => {
    expect(wordLabels('үлөөгөө', noVocabulary, classes)).toEqual([]);
    expect(wordLabels('үлөөгөө', noVocabulary, classes, 'үлөөхэ')).toEqual([{ category: 'verb' }]);
  });

  it('gives no label to a word nothing explains', () => {
    expect(wordLabels('абвгд', noVocabulary, classes)).toEqual([]);
  });
});
