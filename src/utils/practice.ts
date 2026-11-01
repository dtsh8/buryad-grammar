// ─── Practice drills ──────────────────────────────────────────────────────
// Question generators for the Practice page. Every expected answer comes from data
// or code that is already verified elsewhere: verb forms from conjugate() plus the
// PERSON_ENDINGS suffixes, case forms only from the curated CASES examples and the
// гэр paradigm. Nothing here invents a form.

import { CASES, PERSON_ENDINGS, type Person } from '../data/grammar';
import { PARADIGM_FORMS, PARADIGM_NOUN } from '../data/caseParadigm';
import type { Lexeme } from '../data/vocabulary.types';
import type { Lang } from '../i18n/lang';
import { conjugate, extractRoot } from './verbMorphology';
import { decline, type CaseId } from './nounMorphology';
import { isInfinitive, primaryRussianSense, primarySense } from './verbLexicon';

export type Rng = () => number;

type Meaning = Pick<Lexeme, 'english' | 'russian'>; // for gloss()

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

export type ConjugationTense = 'prs' | 'pst' | 'perf' | 'inf';

// The finite forms that take person endings (Verbs page, "Person" tab). Their names are in
// `practice.tenses`; `inf` is the future: ябаха + ending, ябахаб 'I will go'.
export const CONJUGATION_TENSES: ConjugationTense[] = ['prs', 'pst', 'perf', 'inf'];

export interface ConjugationQuestion {
  infinitive: string;
  meaning: Meaning;
  root: string;
  tense: ConjugationTense;
  person: Person;
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
  // Only persons with a form in this tense's column of PERSON_ENDINGS: the perfect and the
  // future have no 3pl. The future 3sg is the bare infinitive, already in the question.
  const column = { prs: 'present', pst: 'past', perf: 'perfect', inf: 'future' } as const;
  const persons = PERSON_ENDINGS.filter(
    p => p[column[tense]] !== undefined && !(tense === 'inf' && p.suffix === '∅')
  );
  const p = pick(persons, rng);
  const root = extractRoot(verb.buryad);
  const stem = conjugate(root)[tense];
  const ending = p.suffix === '∅' ? '' : p.suffix.replace(/^-/, '');
  return {
    infinitive: verb.buryad,
    meaning: { english: primarySense(verb), russian: primaryRussianSense(verb) },
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
  caseId: CaseId;
  stem: string;
  form: string;
  translation: Meaning;
  rule: Record<Lang, string>; // the case's suffix summary, shown after an answer
  generated?: boolean; // built by the declension engine, not a curated example
  nStem?: Lexeme['nStem']; // so feedback can explain a dropped н
}

function caseRule(c: (typeof CASES)[number]): Record<Lang, string> {
  const en = [c.suffix.afterConsonant, c.suffix.afterVowel]
    .filter(Boolean)
    .filter((r, i, all) => all.indexOf(r) === i)
    .join('; ');
  return { en, ru: c.suffixNote?.russian ?? en, bua: c.suffixNote?.buryad ?? en };
}

// Every case form of every vocabulary noun, from the declension engine (its output for
// these nouns is checked against the Buryat National Corpus: nounMorphology.test.ts).
export function generatedCaseItems(lexicon: Lexeme[]): CaseItem[] {
  const items: CaseItem[] = [];
  for (const n of lexicon.filter(l => l.category === 'noun')) {
    const forms = decline(n.buryad, n.nStem);
    const translation = {
      english: n.english.split('/')[0].trim(),
      russian: n.russian?.split('/')[0].trim(),
    };
    for (const c of CASES) {
      if (c.id === 'nominative') continue;
      items.push({
        caseId: c.id as CaseId,
        stem: n.buryad,
        form: forms[c.id as CaseId],
        translation,
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
        caseId: c.id as CaseId,
        stem: ex.stem,
        form: ex.inflected,
        translation: { english: ex.translation, russian: ex.russian },
        rule,
      });
    }
    const paradigm = PARADIGM_FORMS.find(f => f.case_ === c.english);
    if (paradigm) {
      add({
        caseId: c.id as CaseId,
        stem: PARADIGM_NOUN.root,
        form: paradigm.form,
        translation: { english: PARADIGM_NOUN.meaning, russian: PARADIGM_NOUN.russian },
        rule,
      });
    }
  }
  return items;
}

export type CaseQuestion =
  { kind: 'produce'; item: CaseItem } | { kind: 'identify'; item: CaseItem; options: CaseId[] };

// Alternates between typing the form and naming the case of a given form. "Name the case"
// uses curated items only, where each form belongs to exactly one case (see the tests).
export function caseQuestion(items: CaseItem[], rng: Rng): CaseQuestion {
  if (rng() < 0.5) return { kind: 'produce', item: pick(items, rng) };
  const curated = items.filter(i => !i.generated);
  const item = pick(curated, rng);
  const ids = [...new Set(curated.map(i => i.caseId))];
  const others = shuffle(
    ids.filter(id => id !== item.caseId),
    rng
  ).slice(0, 3);
  return { kind: 'identify', item, options: shuffle([item.caseId, ...others], rng) };
}
