import { describe, expect, it } from 'vitest';
import { CASES } from '../data/grammar';
import { PARADIGM_FORMS, PARADIGM_NOUN } from '../data/caseParadigm';
import type { VocabularyData } from '../data/vocabulary.types';
import vocabJson from '../../public/data/vocabulary.json';
import { decline, type CaseId, type NStem } from './nounMorphology';

const vocab = vocabJson as VocabularyData;

// [noun, case, expected form, н type if the noun ends in н]
type Row = [string, CaseId, string, NStem?];

// Учебник бурятского языка, summary table p. 46 and the case lessons it sums up.
const TEXTBOOK: Row[] = [
  ['хүн', 'genitive', 'хүнэй', 'stable'],
  ['гол', 'genitive', 'голой'],
  ['буу', 'genitive', 'буугай'],
  ['хада', 'genitive', 'хадын'],
  ['хани', 'genitive', 'ханиин'],
  ['баабай', 'genitive', 'баабайн'],
  ['гал', 'dative', 'галда'],
  ['эм', 'dative', 'эмдэ'],
  ['он', 'dative', 'ондо', 'stable'],
  ['театр', 'dative', 'театрта'],
  ['класс', 'dative', 'класста'],
  ['шара', 'accusative', 'шарые'],
  ['боти', 'accusative', 'ботиие'],
  ['хараа', 'accusative', 'хараае'],
  ['бороо', 'accusative', 'бороое'],
  ['баха', 'instrumental', 'бахаар'],
  ['бэхэ', 'instrumental', 'бэхээр'],
  ['гохо', 'instrumental', 'гохоор'],
  ['һургуули', 'instrumental', 'һургууляар'],
  ['морин', 'instrumental', 'морёор', 'unstable'],
  ['модон', 'instrumental', 'модоор', 'unstable'],
  ['шулуун', 'instrumental', 'шулуугаар', 'unstable'],
  ['борбилоо', 'instrumental', 'борбилоогоор'],
  ['һалаа', 'instrumental', 'һалаагаар'],
  ['ан', 'instrumental', 'ангаар', 'velar'],
  ['ан', 'accusative', 'ангые', 'velar'],
  ['ан', 'genitive', 'ангай', 'velar'],
  ['ан', 'ablative', 'ангһаа', 'velar'],
  ['зүн', 'ablative', 'зүнгһөө', 'velar'],
  ['морин', 'comitative', 'моритой', 'unstable'],
  ['Сара', 'comitative', 'Саратай'],
  ['аба', 'ablative', 'абаһаа'],
  ['боро', 'ablative', 'бороһоо'],
  ['мал', 'ablative', 'малһаа'],
];

// Buryat National Corpus: the commonest form of each competing pair.
const CORPUS: Row[] = [
  ['хүн', 'accusative', 'хүниие', 'stable'], // 1473
  ['хүн', 'instrumental', 'хүнөөр', 'stable'], // 116
  ['хүн', 'ablative', 'хүнһөө', 'stable'], // 298 vs хүнһээ 3
  ['хүн', 'dative', 'хүндэ', 'stable'], // 2115
  ['үнэн', 'instrumental', 'үнэнөөр', 'stable'], // 110
  ['морин', 'genitive', 'мориной', 'unstable'], // 464
  ['морин', 'dative', 'мориндо', 'unstable'], // 81
  ['морин', 'accusative', 'мориие', 'unstable'], // 49
  ['морин', 'ablative', 'моринһоо', 'unstable'], // 177
  ['модон', 'genitive', 'модоной', 'unstable'], // 582
  ['модон', 'dative', 'модондо', 'unstable'], // 127
  ['модон', 'accusative', 'модые', 'unstable'], // 24
  ['модон', 'comitative', 'модотой', 'unstable'], // 62
  ['модон', 'ablative', 'модонһоо', 'unstable'], // 60
  ['нюдэн', 'instrumental', 'нюдөөр', 'unstable'], // 577: ю counts as ү
  ['нюдэн', 'ablative', 'нюдэнһөө', 'unstable'], // 195
  ['хүбүүн', 'accusative', 'хүбүүе', 'unstable'], // 422
  ['хүбүүн', 'genitive', 'хүбүүнэй', 'unstable'], // 1046
  ['басаган', 'accusative', 'басагые', 'unstable'], // 278
  ['уһан', 'instrumental', 'уһаар', 'unstable'], // 141
  ['уһан', 'dative', 'уһанда', 'unstable'], // 360
  ['мүнгэн', 'instrumental', 'мүнгөөр', 'unstable'], // 131
  ['һалхин', 'instrumental', 'һалхяар', 'unstable'], // 24
  ['гэр', 'ablative', 'гэрһээ'], // 360
  ['ном', 'ablative', 'номһоо'], // 27
];

// Phonology page harmony table.
const PHONOLOGY: Row[] = [
  ['гэр', 'dative', 'гэртэ'],
  ['гэр', 'instrumental', 'гэрээр'],
  ['газар', 'dative', 'газарта'],
  ['газар', 'instrumental', 'газараар'],
  ['ном', 'dative', 'номдо'],
  ['ном', 'instrumental', 'номоор'],
  ['үнэн', 'dative', 'үнэндэ', 'stable'],
  ['үнэн', 'instrumental', 'үнэнөөр', 'stable'],
];

describe('decline', () => {
  for (const [label, rows] of [
    ['textbook', TEXTBOOK],
    ['corpus', CORPUS],
    ['Phonology page', PHONOLOGY],
  ] as const) {
    it(`matches the ${label} forms`, () => {
      for (const [noun, c, form, nStem] of rows) {
        expect(decline(noun, nStem)[c], `${noun} ${c}`).toBe(form);
      }
    });
  }

  it('reproduces the гэр paradigm table', () => {
    const forms = Object.values(decline(PARADIGM_NOUN.root));
    expect(forms).toEqual(PARADIGM_FORMS.map(f => f.form));
  });

  it('reproduces every curated example on the Cases page', () => {
    const N_STEMS: Record<string, NStem> = { хүн: 'stable', мүнгэн: 'unstable', ан: 'velar' };
    for (const c of CASES) {
      if (c.id === 'nominative') continue;
      for (const ex of c.examples) {
        const last = ex.stem.split(' ').at(-1) ?? ex.stem;
        expect(decline(ex.stem, N_STEMS[last])[c.id as CaseId], `${ex.stem} ${c.id}`).toBe(
          ex.inflected
        );
      }
    }
  });

  it('declines only the last word of a phrase', () => {
    expect(decline('галта тэргэ').instrumental).toBe('галта тэргээр');
  });
});

describe('vocabulary nouns', () => {
  const nouns = vocab.entries.filter(e => e.category === 'noun');

  it('every noun ending in н says what its н does', () => {
    for (const n of nouns.filter(n => n.buryad.endsWith('н'))) {
      expect(n.nStem, n.buryad).toBeDefined();
    }
  });

  it('every noun declines to seven distinct-looking Cyrillic forms', () => {
    for (const n of nouns) {
      const forms = Object.values(decline(n.buryad, n.nStem));
      expect(forms, n.buryad).toHaveLength(7);
      for (const f of forms) expect(f, n.buryad).toMatch(/^[а-яёөүһ -]+$/i);
    }
  });
});
