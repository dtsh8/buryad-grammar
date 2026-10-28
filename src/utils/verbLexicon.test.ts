import { describe, expect, it } from 'vitest';
import type { Lexeme, VocabularyData } from '../data/vocabulary.types';
import vocabJson from '../../public/data/vocabulary.json';
import { findVerb, isBuryad, isInfinitive, primarySense, senses } from './verbLexicon';
import { conjugate, extractRoot } from './verbMorphology';

const vocab = vocabJson as VocabularyData;
const verbs = vocab.entries.filter(l => l.category === 'verb');

const lex = (buryad: string, english: string): Lexeme => ({
  id: buryad,
  buryad,
  ipa: '',
  english,
  category: 'verb',
});

describe('verbLexicon', () => {
  it('splits English senses', () => {
    expect(senses('to see / to look')).toEqual(['see', 'look']);
    expect(senses('to sit (remain)')).toEqual(['sit']);
    expect(senses('to return / go back')).toEqual(['return', 'go back']);
  });

  it('recognises Buryad infinitives', () => {
    expect(isInfinitive('хараха')).toBe(true);
    expect(isInfinitive('орохо')).toBe(true);
    expect(isInfinitive('ерэхэ')).toBe(true);
    expect(isInfinitive('харахa')).toBe(false); // Latin a
    expect(isInfinitive('хара')).toBe(false);
    expect(isInfinitive('ном уншаха')).toBe(false);
    expect(isBuryad('see')).toBe(false);
    expect(isBuryad('хараха')).toBe(true);
  });

  it('finds a verb by English sense, infinitive or root', () => {
    const list = [lex('хараха', 'to see / to look'), lex('ябаха', 'to go')];
    expect(findVerb('look', list)?.buryad).toBe('хараха');
    expect(findVerb('To See', list)?.buryad).toBe('хараха');
    expect(findVerb('хараха', list)?.buryad).toBe('хараха');
    expect(findVerb('яба', list)?.buryad).toBe('ябаха');
    expect(findVerb('fly', list)).toBeUndefined();
    expect(primarySense(list[0])).toBe('see');
  });
});

// ─── The curated vocabulary must work with the engine ──────────────────────

describe('vocabulary verbs', () => {
  it('are Cyrillic infinitives', () => {
    for (const v of verbs) expect(isInfinitive(v.buryad), v.id).toBe(true);
  });

  it('round-trip through the engine (root + infinitive suffix = lemma)', () => {
    for (const v of verbs) expect(conjugate(extractRoot(v.buryad)).inf, v.id).toBe(v.buryad);
  });

  it('have unambiguous English senses', () => {
    const seen = new Map<string, string>();
    for (const v of verbs) {
      for (const s of senses(v.english)) {
        expect(seen.get(s), `"${s}" in ${v.id} and ${seen.get(s)}`).toBeUndefined();
        seen.set(s, v.id);
      }
    }
  });
});
