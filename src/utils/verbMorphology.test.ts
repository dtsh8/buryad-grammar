import { describe, expect, it } from 'vitest';
import { VERB_PARADIGMS } from '../data/grammar';
import { conjugate, deriveAll, detectHarmony, endsInVowel, extractRoot } from './verbMorphology';

// ─── Gold forms ────────────────────────────────────────────────────────────
// One row per harmony environment the engine has to handle.
// Sources: Poppe (1960) §§ on vowel harmony; Skribnik (2003).

const GOLD: Array<{ root: string; note: string; forms: Partial<ReturnType<typeof conjugate>> }> = [
  {
    root: 'яба',
    note: 'а-class, short-vowel final',
    forms: { inf: 'ябаха', prs: 'ябана', pst: 'ябаба', seqConv: 'ябаад', jussive: 'ябаг' },
  },
  {
    root: 'унша',
    note: 'у in first syllable does not round',
    forms: { inf: 'уншаха', prs: 'уншана', seqConv: 'уншаад', jussive: 'уншаг' },
  },
  {
    root: 'оро',
    note: 'о-class: short and long suffix vowels round',
    forms: { inf: 'орохо', prs: 'ороно', pst: 'оробо', seqConv: 'ороод', jussive: 'орог' },
  },
  {
    root: 'бай',
    note: 'й-final takes epenthetic г',
    forms: { inf: 'байха', prs: 'байна', seqConv: 'байгаад', jussive: 'байг' },
  },
  {
    root: 'угаа',
    note: 'long-vowel final takes epenthetic г',
    forms: { inf: 'угааха', seqConv: 'угаагаад' },
  },
  {
    root: 'һуу',
    note: 'long уу: epenthetic г, no rounding',
    forms: { inf: 'һууха', seqConv: 'һуугаад' },
  },
  {
    root: 'ерэ',
    note: 'е counts as э; front, unrounded',
    forms: { inf: 'ерэхэ', prs: 'ерэнэ', pst: 'ерэбэ', seqConv: 'ерээд' },
  },
  {
    root: 'мэдэ',
    note: 'front, unrounded',
    forms: { inf: 'мэдэхэ', seqConv: 'мэдээд' },
  },
  {
    root: 'үзэ',
    note: 'ү in first syllable rounds long suffix vowels; short stay э',
    forms: { inf: 'үзэхэ', prs: 'үзэнэ', pst: 'үзэбэ', seqConv: 'үзөөд' },
  },
  {
    root: 'үгэ',
    note: 'ү in first syllable rounds long suffix vowels',
    forms: { inf: 'үгэхэ', seqConv: 'үгөөд' },
  },
  {
    root: 'үзүүл',
    note: 'non-initial үү blocks rounding (cf. оруулаад)',
    forms: { inf: 'үзүүлхэ', seqConv: 'үзүүлээд' },
  },
  {
    root: 'оруул',
    note: 'non-initial уу blocks о-rounding',
    forms: { inf: 'оруулха', prs: 'оруулна', seqConv: 'оруулаад' },
  },
  {
    root: 'уя',
    note: 'я ends in /a/: vowel-final for absorption and jussive',
    forms: { inf: 'уяха', prs: 'уяна', seqConv: 'уяад', jussive: 'уяг' },
  },
  {
    root: 'эдеэ',
    note: 'еэ spells long э: epenthetic г',
    forms: { inf: 'эдеэхэ', prs: 'эдеэнэ', seqConv: 'эдеэгээд', jussive: 'эдеэг' },
  },
];

describe('conjugate — gold forms', () => {
  for (const { root, note, forms } of GOLD) {
    it(`${root}- (${note})`, () => {
      const actual = conjugate(root);
      for (const [key, expected] of Object.entries(forms)) {
        expect(actual[key as keyof typeof actual], key).toBe(expected);
      }
    });
  }

  it('consonant-final jussive follows the а/о/э class (mechanism; бол- is not a real stem)', () => {
    expect(conjugate('бол').jussive).toBe('болог');
    expect(conjugate('хүдэл').jussive).toBe('хүдэлэг');
  });

  it('never produces three vowels in a row', () => {
    // Iotated я/е/ё/ю contain й, so they may only start a run (уяад is fine; эдеээд is not)
    const tripleVowel = /[аоуэөүиыяеёю][аоуэөүиы]{2}/;
    for (const { root } of GOLD) {
      for (const form of Object.values(conjugate(root))) {
        expect(form).not.toMatch(tripleVowel);
      }
    }
  });
});

// ─── Static paradigm tables must agree with the engine ──────────────────────
// VERB_PARADIGMS is hand-written; this keeps it and conjugate() in sync.
// Known irregulars are listed explicitly rather than silently skipped.

const KEY_MAP = {
  infinitive: 'inf',
  presentFuture: 'prs',
  simplePast: 'pst',
  evidentialPast: 'evidPst',
  habitual: 'hab',
  simultConv: 'simConv',
  seqConv: 'seqConv',
  jussive: 'jussive',
} as const;

const KNOWN_IRREGULAR: Record<string, string[]> = {
  // эдеэ- has a suppletive stem эди- before -дэг / -жэ
  // seqConv: table has эдеэд, engine rule gives эдеэгээд — unverified, needs a source
  эдеэ: ['habitual', 'simultConv', 'seqConv'],
};

describe('VERB_PARADIGMS agrees with conjugate()', () => {
  for (const vp of VERB_PARADIGMS) {
    it(vp.infinitive, () => {
      const actual = conjugate(vp.root);
      const skip = KNOWN_IRREGULAR[vp.root] ?? [];
      for (const [tableKey, engineKey] of Object.entries(KEY_MAP)) {
        if (skip.includes(tableKey)) continue;
        const expected = vp.forms[tableKey as keyof typeof vp.forms].replace(/!$/, '');
        expect(actual[engineKey], tableKey).toBe(expected);
      }
    });
  }
});

// ─── Helpers ───────────────────────────────────────────────────────────────

describe('helpers', () => {
  it('extractRoot strips all three infinitive suffixes', () => {
    expect(extractRoot('ябаха')).toBe('яба');
    expect(extractRoot('орохо')).toBe('оро');
    expect(extractRoot('ерэхэ')).toBe('ерэ');
  });

  it('endsInVowel recognises iotated vowels', () => {
    expect(endsInVowel('уя')).toBe(true);
    expect(endsInVowel('хүдэл')).toBe(false);
  });

  it('detectHarmony', () => {
    expect(detectHarmony('яба')).toBe('back');
    expect(detectHarmony('ерэ')).toBe('front');
    expect(detectHarmony('үзэ')).toBe('front');
  });
});

// ─── Derivations ───────────────────────────────────────────────────────────

describe('deriveAll', () => {
  const byLabel = (root: string) => Object.fromEntries(deriveAll(root, 'x').map(d => [d.label, d]));

  it('causative', () => {
    expect(byLabel('яба').Causative.inf).toBe('ябуулха');
    expect(byLabel('унша').Causative.inf).toBe('уншуулха');
    expect(byLabel('оро').Causative.inf).toBe('оруулха');
  });

  it('passive', () => {
    expect(byLabel('унша').Passive.inf).toBe('уншагдаха');
    expect(byLabel('мэдэ').Passive.inf).toBe('мэдэгдэхэ');
  });

  it('о-class stems take о-variants of derivational suffixes', () => {
    const d = byLabel('оро');
    expect(d.Passive.root).toBe('орогдо');
    expect(d.Reflexive.root).toBe('оро' + 'до');
    expect(d.Reciprocal.root.endsWith('о')).toBe(true);
    expect(d.Cooperative.root.endsWith('о')).toBe(true);
  });
});
