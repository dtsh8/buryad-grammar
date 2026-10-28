// ─── Verb lookup for the Verb Builder ─────────────────────────────────────
// The curated vocabulary (public/data/vocabulary.json) is the first source of verbs;
// machine translation is only a fallback, and its output is checked before use.

import type { Lexeme } from '../data/vocabulary.types';

const CYRILLIC = /[а-яёөүһ]/i;

// A Buryad infinitive is one Cyrillic word ending in -ха / -хо / -хэ.
const INFINITIVE = /^[а-яёөүһ]+х[аоэ]$/;

export function isBuryad(text: string): boolean {
  return CYRILLIC.test(text);
}

export function isInfinitive(word: string): boolean {
  return INFINITIVE.test(word.trim().toLowerCase());
}

// "to see / to look" → ["see", "look"]; "to sit (remain)" → ["sit"]
export function senses(english: string): string[] {
  return english
    .split('/')
    .map(s =>
      s
        .replace(/\(.*?\)/g, '')
        .replace(/^\s*to\s+/i, '')
        .trim()
        .toLowerCase()
    )
    .filter(Boolean);
}

function normalise(query: string): string {
  return query
    .trim()
    .toLowerCase()
    .replace(/^to\s+/, '')
    .replace(/\s+/g, ' ');
}

// Find a curated verb by English sense ("see", "to look") or by its Buryad
// infinitive or root ("хараха", "хара").
export function findVerb(query: string, lexicon: Lexeme[]): Lexeme | undefined {
  const q = normalise(query);
  if (!q) return undefined;
  const verbs = lexicon.filter(l => l.category === 'verb');
  if (isBuryad(q)) {
    return verbs.find(v => v.buryad === q || v.buryad.replace(/х[аоэ]$/, '') === q);
  }
  return verbs.find(v => senses(v.english).includes(q));
}

// The English meaning to use for glosses: the first sense of a lexicon entry.
export function primarySense(lexeme: Lexeme): string {
  return senses(lexeme.english)[0] ?? lexeme.english;
}
