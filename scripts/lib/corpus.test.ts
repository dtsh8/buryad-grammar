import { describe, expect, it } from 'vitest';
import { CASES, CONVERBS, TENSE_ENTRIES, VERB_DERIVATIONS } from '../../src/data/grammar.ts';
import type { CorpusExamplesData } from '../../src/data/corpus.types.ts';
import built from '../../public/data/corpus_examples.json';
import { FEATURES, findMatch } from './features.ts';
import { normaliseText, splitSentences, tokenize } from './text.ts';

const feature = (id: string) => FEATURES.find(f => f.id === id)!;

describe('normaliseText', () => {
  it('turns Latin h inside Buryad words into һ (burunen.ru types гэhэн, hургуули)', () => {
    expect(normaliseText('гэhэн hургуули Hайн')).toBe('гэһэн һургуули Һайн');
  });

  it('fixes Latin lookalikes in Cyrillic words but leaves Latin words alone', () => {
    expect(normaliseText('нютагтa')).toBe('нютагта');
    expect(normaliseText('Google')).toBe('Google');
  });

  it('keeps digits and punctuation', () => {
    expect(normaliseText('2024 оной 26-аа (№ 5), 10%')).toBe('2024 оной 26-аа (№ 5), 10%');
  });

  it('drops other symbols and collapses spaces', () => {
    expect(normaliseText('ном   ★ уншана\n')).toBe('ном уншана');
  });
});

describe('tokenize / splitSentences', () => {
  it('lower-cases Buryad words, including ү ө һ', () => {
    expect(tokenize('Һургуулиһаа Үдэр 2024')).toEqual(['һургуулиһаа', 'үдэр']);
  });

  it('splits on sentence-final punctuation before a capital', () => {
    const s = splitSentences('Тэрэ ябаа гэртээ эртэ үглөөгүүр. Бидэ һургуулида ошобобди мүнөө.');
    expect(s).toHaveLength(2);
  });
});

describe('findMatch', () => {
  it('matches finite verbs only in sentence-final position, skipping particles', () => {
    expect(findMatch('Бидэ һургуулида ошобобди', feature('verb_past'))).toBe('ошобобди');
    expect(findMatch('Тэрэ ном уншаһан юм', feature('verb_past_participle'))).toBe('уншаһан');
    expect(findMatch('Хүдэлбэ хүн гэртээ ерээ', feature('verb_past'))).toBeNull();
  });

  it('ignores the stop list (буряад is not a converb)', () => {
    expect(findMatch('Буряад хэлэн', feature('converb_sequential'))).toBeNull();
    expect(findMatch('Ажалаа дүүргээд гэртээ ерэбэ', feature('converb_sequential'))).toBe(
      'дүүргээд'
    );
  });

  it('finds the concessive -аашье һаа', () => {
    expect(findMatch('Тэрэ хашхараашье һаа, бү ерэгты', feature('converb_concessive'))).toBe(
      'хашхараашье һаа'
    );
  });

  it('skips numerals in -аад "about N"', () => {
    expect(findMatch('Табяад хонитой', feature('converb_sequential'))).toBeNull();
  });

  it('requires a stem of two letters or more', () => {
    expect(findMatch('Энэ һаа', feature('case_ablative'))).toBeNull();
    expect(findMatch('Москваһаа ерэбэ', feature('case_ablative'))).toBe('Москваһаа');
  });
});

// ─── The app's links into public/data/corpus_examples.json ──────────────────

describe('corpus_examples.json', () => {
  const data = built as CorpusExamplesData;
  const linked = [
    ...CASES.filter(c => c.id !== 'nominative').map(c => `case_${c.id}`),
    ...[...TENSE_ENTRIES, ...CONVERBS, ...VERB_DERIVATIONS].flatMap(e =>
      e.corpusFeature ? [e.corpusFeature] : []
    ),
  ];

  it('has a feature definition and examples for every id the app links to', () => {
    const defined = new Set(FEATURES.map(f => f.id));
    for (const id of linked) {
      expect(defined.has(id), id).toBe(true);
      expect(data.features[id]?.examples.length ?? 0, id).toBeGreaterThan(0);
    }
  });

  it('every example contains its matched word', () => {
    for (const [id, f] of Object.entries(data.features)) {
      for (const ex of f.examples) expect(ex.sentence, id).toContain(ex.match);
    }
  });
});
