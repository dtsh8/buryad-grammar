// ─── Practice drills ──────────────────────────────────────────────────────
// Question generators for the Practice page. Every expected answer comes from data
// or code that is already verified elsewhere: verb forms from conjugate() plus the
// PERSON_ENDINGS suffixes, case forms only from the curated CASES examples and the
// гэр paradigm. Nothing here invents a form.

import { CASES, PERSON_ENDINGS } from '../data/grammar';
import { PARADIGM_FORMS, PARADIGM_NOUN } from '../data/caseParadigm';
import type { Lexeme } from '../data/vocabulary.types';
import { conjugate, extractRoot } from './verbMorphology';
import { decline, type CaseId } from './nounMorphology';
import { isInfinitive, primarySense } from './verbLexicon';

export type Rng = () => number;

export function pick<T>(items: readonly T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)];
}

export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ─── Answer checking ──────────────────────────────────────────────────────

export type Verdict = 'correct' | 'almost' | 'wrong';

function normalise(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

// On a Russian keyboard һ, ү, ө are often typed as х (or Latin h), у, о.
const KEYBOARD_FOLD: Record<string, string> = { һ: 'х', h: 'х', ү: 'у', ө: 'о' };

function fold(s: string): string {
  return [...s].map(c => KEYBOARD_FOLD[c] ?? c).join('');
}

// "almost" = right apart from a Buryad-only letter typed as its Russian look-alike.
export function checkAnswer(input: string, expected: string): Verdict {
  const a = normalise(input);
  const b = normalise(expected);
  if (a === b) return 'correct';
  if (a && fold(a) === fold(b)) return 'almost';
  return 'wrong';
}

// ─── Conjugation drill ────────────────────────────────────────────────────

export interface ConjugationTense {
  id: 'prs' | 'pst' | 'perf';
  label: string;
}

// The finite forms that take person endings (Verbs page, "Person" tab).
export const CONJUGATION_TENSES: ConjugationTense[] = [
  { id: 'prs', label: 'Present-Future' },
  { id: 'pst', label: 'Simple Past' },
  { id: 'perf', label: 'Perfect' },
];

export interface ConjugationQuestion {
  infinitive: string;
  meaning: string;
  root: string;
  tense: ConjugationTense;
  person: string;
  pronoun: string;
  stem: string; // the tense form before the person ending
  ending: string; // '' for 3sg
  answer: string;
}

export function drillVerbs(lexicon: Lexeme[]): Lexeme[] {
  return lexicon.filter(l => l.category === 'verb' && isInfinitive(l.buryad));
}

export function conjugationQuestion(verbs: Lexeme[], rng: Rng): ConjugationQuestion {
  const verb = pick(verbs, rng);
  const tense = pick(CONJUGATION_TENSES, rng);
  // The perfect has no 3pl form: ябаа-д would merge with the converb ябаад.
  const persons = PERSON_ENDINGS.filter(p => tense.id !== 'perf' || p.perfect);
  const p = pick(persons, rng);
  const root = extractRoot(verb.buryad);
  const stem = conjugate(root)[tense.id];
  const ending = p.suffix === '∅' ? '' : p.suffix.replace(/^-/, '');
  return {
    infinitive: verb.buryad,
    meaning: primarySense(verb),
    root,
    tense,
    person: p.person,
    pronoun: p.pronoun,
    stem,
    ending,
    answer: stem + ending,
  };
}

// ─── Case drill ───────────────────────────────────────────────────────────

export interface CaseItem {
  caseId: string;
  caseName: string;
  stem: string;
  form: string;
  translation: string;
  rule: string; // the case's suffix summary, shown after an answer
  generated?: boolean; // built by the declension engine, not a curated example
  nStem?: Lexeme['nStem']; // so feedback can explain a dropped н
}

function caseRule(c: (typeof CASES)[number]): string {
  return [c.suffix.afterConsonant, c.suffix.afterVowel]
    .filter(Boolean)
    .filter((r, i, all) => all.indexOf(r) === i)
    .join('; ');
}

// Every case form of every vocabulary noun, from the declension engine (its output for
// these nouns is checked against the Buryat National Corpus: nounMorphology.test.ts).
export function generatedCaseItems(lexicon: Lexeme[]): CaseItem[] {
  const items: CaseItem[] = [];
  for (const n of lexicon.filter(l => l.category === 'noun')) {
    const forms = decline(n.buryad, n.nStem);
    const meaning = n.english.split('/')[0].trim();
    for (const c of CASES) {
      if (c.id === 'nominative') continue;
      items.push({
        caseId: c.id,
        caseName: c.english,
        stem: n.buryad,
        form: forms[c.id as CaseId],
        translation: `${meaning} (${c.english.toLowerCase()})`,
        rule: caseRule(c),
        generated: true,
        nStem: n.nStem,
      });
    }
  }
  return items;
}

// Every curated case form except the nominative, which has no suffix to practise.
export function caseItems(): CaseItem[] {
  const items: CaseItem[] = [];
  const seen = new Set<string>();
  const add = (item: CaseItem) => {
    const key = item.caseId + '|' + item.form;
    if (seen.has(key)) return;
    seen.add(key);
    items.push(item);
  };
  for (const c of CASES) {
    if (c.id === 'nominative') continue;
    const rule = caseRule(c);
    for (const ex of c.examples) {
      add({
        caseId: c.id,
        caseName: c.english,
        stem: ex.stem,
        form: ex.inflected,
        translation: ex.translation,
        rule,
      });
    }
    const paradigm = PARADIGM_FORMS.find(f => f.case_ === c.english);
    if (paradigm) {
      add({
        caseId: c.id,
        caseName: c.english,
        stem: PARADIGM_NOUN.root,
        form: paradigm.form,
        translation: `${PARADIGM_NOUN.meaning} (${c.english.toLowerCase()})`,
        rule,
      });
    }
  }
  return items;
}

export type CaseQuestion =
  { kind: 'produce'; item: CaseItem } | { kind: 'identify'; item: CaseItem; options: string[] };

// Alternates between typing the form and naming the case of a given form. "Name the case"
// uses curated items only, where each form belongs to exactly one case (see the tests).
export function caseQuestion(items: CaseItem[], rng: Rng): CaseQuestion {
  if (rng() < 0.5) return { kind: 'produce', item: pick(items, rng) };
  const curated = items.filter(i => !i.generated);
  const item = pick(curated, rng);
  const names = [...new Set(curated.map(i => i.caseName))];
  const others = shuffle(
    names.filter(n => n !== item.caseName),
    rng
  ).slice(0, 3);
  return { kind: 'identify', item, options: shuffle([item.caseName, ...others], rng) };
}
