// ─── Reader: what kind of word this is ─────────────────────────────────────
// A label for the tooltip, from the surest source that has one: the vocabulary, then the
// dictionary's word list (public/data/word-classes.json, А–Р only, built by
// scripts/word_classes.py), then a verb form's ending. Other words get no label: a wrong one would
// teach something false, and Burlang gives no parts of speech.

import { CASES } from '../data/grammar';
import type { LexemeCategory } from '../data/vocabulary.types';
import type { Lang } from '../i18n/lang';
import { decline, type CaseId, type NStem } from './nounMorphology';
import { caseOf } from './phrases';
import { lookup, verbReadings, type ReaderIndex, type VerbKind } from './reader';
import { getSufClass } from './verbMorphology';

export type WordClass = 'noun' | 'adjective' | 'numeral';

const WORD_CLASSES: WordClass[] = ['noun', 'adjective', 'numeral'];

export type WordClassData = Record<WordClass, string[]> & { source: string };
export type ClassIndex = Map<string, WordClass[]>;

export interface WordLabel {
  category: LexemeCategory;
  kind?: VerbKind;
  nounCase?: CaseId; // not the nominative, which needs no mention
  unsure?: boolean; // a guess from the word's ending
}

export function buildClassIndex(data: WordClassData): ClassIndex {
  const index: ClassIndex = new Map();
  for (const name of WORD_CLASSES) {
    for (const word of data[name]) index.set(word, [...(index.get(word) ?? []), name]);
  }
  return index;
}

export function caseName(id: CaseId, lang: Lang): string {
  const found = CASES.find(c => c.id === id);
  if (!found) return id;
  if (lang === 'ru') return found.russian;
  return lang === 'bua' ? found.buryad : found.english;
}

const LONGEST_ENDING = 5; // letters: -гһаа, plus a final vowel lost before it
const N_STEMS: Array<NStem | undefined> = [undefined, 'stable', 'unstable', 'velar'];

// A dictionary noun the word is a case form of: нютагта → нютаг. As with verbs, each cut gives a
// possible stem, kept only if the engine builds the word from it again.
function declinedNoun(word: string, classes: ClassIndex): CaseId | undefined {
  for (let cut = 1; cut <= LONGEST_ENDING; cut++) {
    const stem = word.slice(0, -cut);
    if (!/[аоуэөүиыяеёю]/.test(stem)) break;
    for (const noun of [stem, stem + getSufClass(stem), stem + 'и', stem + 'н']) {
      if (!classes.get(noun)?.includes('noun')) continue;
      for (const nStem of N_STEMS) {
        const forms = Object.entries(decline(noun, nStem));
        const form = forms.find(([id, f]) => f === word && id !== 'nominative');
        if (form) return form[0] as CaseId;
      }
    }
  }
  return undefined;
}

function verbLabels(key: string, lemmas: string[]): WordLabel[] {
  return verbReadings(key)
    .filter(r => lemmas.includes(r.infinitive))
    .map(r => ({ category: 'verb' as const, kind: r.kind }));
}

function unique(labels: WordLabel[]): WordLabel[] {
  const seen = new Set<string>();
  return labels.filter(label => {
    const id = JSON.stringify(label);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

// `lemma` is a verb the online dictionary confirmed for this word, once it has answered.
export function wordLabels(
  key: string,
  index: ReaderIndex,
  classes: ClassIndex,
  lemma?: string
): WordLabel[] {
  const known = lookup(key, index).flatMap((l): WordLabel[] => {
    if (l.category === 'verb') {
      const forms = verbLabels(key, [l.buryad.toLowerCase()]);
      return forms.length > 0 ? forms : [{ category: 'verb' }];
    }
    if (l.category !== 'noun') return [{ category: l.category }];
    const nounCase = caseOf(key, index);
    return [
      nounCase && nounCase !== 'nominative' ? { category: 'noun', nounCase } : { category: 'noun' },
    ];
  });
  // The dictionary may add a reading the vocabulary lacks: ерээд is also a numeral.
  const listed = (classes.get(key) ?? []).map((category): WordLabel => ({ category }));
  const sure = unique([
    ...known,
    ...listed.filter(l => !known.some(k => k.category === l.category)),
  ]);
  if (sure.length > 0) return sure;

  const nounCase = declinedNoun(key, classes);
  if (nounCase) return [{ category: 'noun', nounCase }];
  if (lemma) return unique(verbLabels(key, [lemma]));
  return unique(
    verbReadings(key)
      .filter(r => r.distinctive)
      .map(r => ({ category: 'verb' as const, kind: r.kind, unsure: true }))
  );
}
