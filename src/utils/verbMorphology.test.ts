import { describe, expect, it } from 'vitest';
import {
  CASES,
  CONVERBS,
  PERSON_ENDINGS,
  TENSE_ENTRIES,
  VERB_DERIVATIONS,
  VERB_PARADIGMS,
} from '../data/grammar';
import { conjugate, deriveAll, detectHarmony, endsInVowel, extractRoot } from './verbMorphology';

// ─── Gold forms ────────────────────────────────────────────────────────────
// One row per harmony environment the engine has to handle.
// Sources: Poppe (1960) §§ on vowel harmony; Skribnik (2003); rows marked "corpus"
// are attested in the burunen.ru corpus (docs/verification-questions.md).

const GOLD: Array<{ root: string; note: string; forms: Partial<ReturnType<typeof conjugate>> }> = [
  {
    root: 'яба',
    note: 'а-class, short-vowel final',
    forms: {
      inf: 'ябаха',
      prs: 'ябана',
      pst: 'ябаба',
      perf: 'ябаа',
      pstPtcp: 'ябаһан',
      neg: 'ябадаггүй',
      negPst: 'ябаагүй',
      seqConv: 'ябаад',
      jussive: 'ябаг',
    },
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
    forms: { inf: 'байха', prs: 'байна', perf: 'байгаа', seqConv: 'байгаад', jussive: 'байг' },
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
    root: 'түлеэ',
    note: 'еэ spells long э: epenthetic г; non-initial long ээ blocks rounding (cf. corpus түлеэгээр)',
    forms: { inf: 'түлеэхэ', seqConv: 'түлеэгээд' },
  },
  {
    root: 'хүрэ',
    note: 'corpus хүрөөд',
    forms: { seqConv: 'хүрөөд' },
  },
  {
    root: 'хүдэл',
    note: 'corpus хүдэлөөд, хүдэлөө',
    forms: { inf: 'хүдэлхэ', seqConv: 'хүдэлөөд', perf: 'хүдэлөө' },
  },
  {
    root: 'хөөрэлдэ',
    note: 'long өө in first syllable rounds (corpus хөөрэлдөөд)',
    forms: { seqConv: 'хөөрэлдөөд' },
  },
  {
    root: 'дүүргэ',
    note: 'long үү in first syllable does not round (corpus дүүргээд ×25)',
    forms: { seqConv: 'дүүргээд' },
  },
  {
    root: 'бүтээ',
    note: 'non-initial long ээ blocks rounding from ү (corpus бүтээгээд, бүтээһэн)',
    forms: { seqConv: 'бүтээгээд', pstPtcp: 'бүтээһэн', neg: 'бүтээдэггүй' },
  },
  {
    root: 'эди',
    note: 'и-stem: и + ээ → еэ (corpus эдихэ, эдидэг, эдижэ, эдеэд)',
    forms: {
      inf: 'эдихэ',
      prs: 'эдинэ',
      hab: 'эдидэг',
      simConv: 'эдижэ',
      perf: 'эдеэ',
      negPst: 'эдеэгүй',
      seqConv: 'эдеэд',
    },
  },
  {
    root: 'бари',
    note: 'и-stem: и + аа → яа (corpus бариха, барижа, баридаг, баряад, баряа)',
    forms: { inf: 'бариха', simConv: 'барижа', hab: 'баридаг', seqConv: 'баряад', perf: 'баряа' },
  },
  {
    root: 'таби',
    note: 'и-stem (corpus табяа "put"; табяад in the corpus is the numeral "about fifty")',
    forms: { perf: 'табяа' },
  },
  {
    root: 'боли',
    note: 'и-stem, о-class: и + оо → ёо (corpus болёод)',
    forms: { seqConv: 'болёод' },
  },
  {
    root: 'үрди',
    note: 'front и-stem gets еэ even after ү (Skribnik & Darzhaeva 2020 үрдеэд; corpus үрдеэгүй)',
    forms: { seqConv: 'үрдеэд', negPst: 'үрдеэгүй' },
  },
  {
    root: 'ури',
    note: 'и-stem, short suffixes unchanged (corpus урина, уриба, урижа)',
    forms: { prs: 'урина', pst: 'уриба', simConv: 'урижа', perf: 'уряа' },
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

  it('resultative -нхай (textbook ерэнхэй, ошонхой; corpus болонхой, гаранхай, бэшэнхэй, байнхай)', () => {
    expect(conjugate('ерэ').res).toBe('ерэнхэй');
    expect(conjugate('ошо').res).toBe('ошонхой');
    expect(conjugate('бол').res).toBe('болонхой');
    expect(conjugate('гара').res).toBe('гаранхай');
    expect(conjugate('бэшэ').res).toBe('бэшэнхэй');
    expect(conjugate('бари').res).toBe('баринхай');
    expect(conjugate('бай').res).toBe('байнхай');
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
// Irregular stems are handled by the engine's IRREGULAR table, so no skips here.

const KEY_MAP = {
  infinitive: 'inf',
  presentFuture: 'prs',
  simplePast: 'pst',
  perfect: 'perf',
  pastParticiple: 'pstPtcp',
  habitual: 'hab',
  negPresentFuture: 'neg',
  negPast: 'negPst',
  simultConv: 'simConv',
  seqConv: 'seqConv',
  jussive: 'jussive',
} as const;

describe('VERB_PARADIGMS agrees with conjugate()', () => {
  for (const vp of VERB_PARADIGMS) {
    it(vp.infinitive, () => {
      const actual = conjugate(vp.root);
      for (const [tableKey, engineKey] of Object.entries(KEY_MAP)) {
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

  it('causative allomorphs (Buryat National Corpus counts)', () => {
    expect(byLabel('һуу').Causative.inf).toBe('һуулгаха'); // 38
    expect(byLabel('уу').Causative.inf).toBe('уулгаха'); // 16
    expect(byLabel('угаа').Causative.inf).toBe('угаалгаха'); // 3
    expect(byLabel('бай').Causative.inf).toBe('байлгаха'); // 68
    expect(byLabel('гүй').Causative.inf).toBe('гүйлгэхэ'); // 14
    expect(byLabel('эди').Causative.inf).toBe('эдюулхэ'); // 33
    expect(byLabel('эди').Causative.perf).toBe('эдюулээ'); // 11
    expect(byLabel('бари').Causative.inf).toBe('барюулха'); // 43
    expect(byLabel('гара').Causative.inf).toBe('гаргаха'); // 284
    expect(byLabel('боло').Causative.inf).toBe('болгохо'); // 300
    expect(byLabel('гара').Causative.suffix).toBe('-га');
    expect(byLabel('һуу').Causative.suffix).toBe('+лга');
  });

  it('й-final stems take consonant-initial suffixes directly (BNC гүйлдэхэ 29)', () => {
    expect(byLabel('гүй').Reciprocal.inf).toBe('гүйлдэхэ');
    expect(byLabel('гүй').Passive.root).toBe('гүйгдэ');
  });

  it('passive', () => {
    expect(byLabel('унша').Passive.inf).toBe('уншагдаха');
    expect(byLabel('мэдэ').Passive.inf).toBe('мэдэгдэхэ');
    expect(byLabel('хара').Passive.inf).toBe('харагдаха');
  });

  it('passive -да/-та stems (textbook p. 84; corpus абтаа, үгтэнэ, олдоно)', () => {
    expect(byLabel('аба').Passive.inf).toBe('абтаха');
    expect(byLabel('аба').Passive.suffix).toBe('-та');
    expect(byLabel('үгэ').Passive.inf).toBe('үгтэхэ');
    expect(byLabel('оло').Passive.inf).toBe('олдохо');
  });

  it('has no reflexive voice (none in the textbook or corpus)', () => {
    expect(deriveAll('яба', 'x').map(d => d.label)).not.toContain('Reflexive');
  });

  it('reciprocal is -лда, cooperative is -лса (corpus барилдаха, оролсохо)', () => {
    expect(byLabel('бари').Reciprocal.inf).toBe('барилдаха');
    expect(byLabel('оро').Cooperative.inf).toBe('оролсохо');
  });

  it('о-class stems take о-variants of derivational suffixes', () => {
    const d = byLabel('оро');
    expect(d.Passive.root).toBe('орогдо');
    expect(d.Reciprocal.root.endsWith('о')).toBe(true);
    expect(d.Cooperative.root.endsWith('о')).toBe(true);
  });
});

// ─── Data tables built on the engine ───────────────────────────────────────

describe('grammar data', () => {
  it('person-ending table is the engine form plus the ending', () => {
    const { prs, pst, perf } = conjugate('яба');
    for (const p of PERSON_ENDINGS) {
      const ending = p.suffix === '∅' ? '' : p.suffix.replace(/^-/, '');
      expect(p.present, p.person).toBe(prs + ending);
      expect(p.past, p.person).toBe(pst + ending);
      if (p.perfect) expect(p.perfect, p.person).toBe(perf + ending);
    }
  });

  it('Buryat National Corpus links are word-form patterns (Cyrillic, * as wildcard)', () => {
    const queries = [...CASES, ...TENSE_ENTRIES, ...CONVERBS, ...VERB_DERIVATIONS].flatMap(e =>
      e.corpusQuery ? [e.corpusQuery] : []
    );
    expect(queries.length).toBeGreaterThan(15);
    for (const q of queries) expect(q).toMatch(/^\*[а-яёөүһ]+\*?$/);
  });

  it('no tense entry teaches the rare literary -лай past as a standard tense', () => {
    for (const t of TENSE_ENTRIES) expect(t.suffix.back).not.toMatch(/лай/);
  });
});
