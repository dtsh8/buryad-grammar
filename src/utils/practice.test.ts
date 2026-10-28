import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { VocabularyData } from '../data/vocabulary.types';
import {
  caseItems,
  caseQuestion,
  checkAnswer,
  conjugationQuestion,
  drillVerbs,
  generatedCaseItems,
  type Rng,
} from './practice';

const lexicon = (JSON.parse(readFileSync('public/data/vocabulary.json', 'utf8')) as VocabularyData)
  .entries;

// Deterministic generator (mulberry32) so failures are reproducible.
function seeded(seed: number): Rng {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('checkAnswer', () => {
  it('accepts exact answers, ignoring case and outer spaces', () => {
    expect(checkAnswer('  Ябанаб ', 'ябанаб')).toBe('correct');
    expect(checkAnswer('галта  тэргээр', 'галта тэргээр')).toBe('correct');
  });

  it('marks Russian look-alikes of һ, ү, ө as almost', () => {
    expect(checkAnswer('гэрхээ', 'гэрһээ')).toBe('almost');
    expect(checkAnswer('гэрhээ', 'гэрһээ')).toBe('almost');
    expect(checkAnswer('худелнэ', 'хүдэлнэ')).toBe('wrong'); // э → е is a real error
    expect(checkAnswer('худэлоо', 'хүдэлөө')).toBe('almost');
  });

  it('rejects wrong and empty answers', () => {
    expect(checkAnswer('ябанаш', 'ябанаб')).toBe('wrong');
    expect(checkAnswer('', 'ябанаб')).toBe('wrong');
  });
});

describe('conjugation drill', () => {
  const verbs = drillVerbs(lexicon);

  it('drills every curated verb infinitive', () => {
    expect(verbs.length).toBeGreaterThan(20);
    expect(verbs.every(v => v.category === 'verb')).toBe(true);
  });

  it('matches the person-ending paradigm for яба', () => {
    const yaba = verbs.filter(v => v.buryad === 'ябаха');
    const answers = new Set<string>();
    const rng = seeded(1);
    for (let i = 0; i < 400; i++) answers.add(conjugationQuestion(yaba, rng).answer);
    // PERSON_ENDINGS: present, -ба past and perfect rows (no perfect 3pl).
    for (const form of ['ябанаб', 'ябанаш', 'ябана', 'ябанабди', 'ябанат', 'ябанад']) {
      expect(answers).toContain(form);
    }
    for (const form of ['ябабаб', 'ябабад', 'ябааб', 'ябаабди', 'ябаат']) {
      expect(answers).toContain(form);
    }
    expect(answers).not.toContain('ябаад');
    // Future -ха + ending (BNC: ябахаб 114, ябахабди 60); no 3pl, and no bare 3sg question
    for (const form of ['ябахаб', 'ябахаш', 'ябахабди', 'ябахат']) expect(answers).toContain(form);
    expect(answers).not.toContain('ябахад');
  });

  it('builds answers as tense form + person ending', () => {
    const rng = seeded(2);
    for (let i = 0; i < 200; i++) {
      const q = conjugationQuestion(verbs, rng);
      expect(q.answer).toBe(q.stem + q.ending);
      expect(q.infinitive.startsWith(q.root)).toBe(true);
    }
  });
});

describe('case drill', () => {
  const items = caseItems();

  it('covers every case except the nominative', () => {
    const ids = new Set(items.map(i => i.caseId));
    expect(ids).not.toContain('nominative');
    expect(ids.size).toBe(6);
  });

  it('never repeats a form within a case', () => {
    const keys = items.map(i => i.caseId + '|' + i.form);
    expect(new Set(keys).size).toBe(keys.length);
  });

  // An "identify the case" question needs exactly one right answer.
  it('has no form that belongs to two cases', () => {
    const byForm = new Map<string, Set<string>>();
    for (const i of items) byForm.set(i.form, (byForm.get(i.form) ?? new Set()).add(i.caseId));
    for (const [form, cases] of byForm) expect(cases.size, form).toBe(1);
  });

  it('offers four distinct options including the right one', () => {
    const rng = seeded(3);
    for (let i = 0; i < 200; i++) {
      const q = caseQuestion(items, rng);
      if (q.kind !== 'identify') continue;
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options).toContain(q.item.caseName);
    }
  });
});

describe('case drill with generated nouns', () => {
  const generated = generatedCaseItems(lexicon);
  const nouns = lexicon.filter(l => l.category === 'noun');

  it('asks for all six cases of every vocabulary noun', () => {
    expect(generated).toHaveLength(nouns.length * 6);
    expect(generated.every(i => i.generated && i.form.length > 0)).toBe(true);
  });

  it('uses generated items only for "form the case" questions', () => {
    const items = [...caseItems(), ...generated];
    const rng = seeded(4);
    let produced = 0;
    for (let i = 0; i < 400; i++) {
      const q = caseQuestion(items, rng);
      if (q.kind === 'identify') expect(q.item.generated).toBeFalsy();
      else if (q.item.generated) produced++;
    }
    expect(produced).toBeGreaterThan(0);
  });
});
