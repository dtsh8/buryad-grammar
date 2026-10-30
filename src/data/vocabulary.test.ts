import { describe, expect, it } from 'vitest';
import type { VocabularyData } from './vocabulary.types';
import vocabJson from '../../public/data/vocabulary.json';

const vocab = vocabJson as VocabularyData;

// prettier-ignore
const LATIN: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', ө: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
  ү: 'u', ф: 'f', х: 'kh', һ: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y',
  ь: '', э: 'e', ю: 'yu', я: 'ya',
};

// The id is the Buryad headword in plain ASCII, words joined by hyphens. Word-initial е is
// ye, which keeps ехэ (yekhe) apart from эхэ (ekhe).
function idFor(buryad: string): string {
  return buryad
    .toLowerCase()
    .replace(/[^\p{L}\s-]/gu, '')
    .trim()
    .split(/\s+/)
    .map(word => [...word].map((c, i) => (c === 'е' && i === 0 ? 'ye' : LATIN[c])).join(''))
    .join('-');
}

describe('vocabulary.json', () => {
  // Ids once went stale when a headword was replaced: наадаха kept "bülüükhe".
  it('spells every id from its Buryad headword', () => {
    for (const e of vocab.entries) {
      expect(e.id, e.buryad).toBe(idFor(e.buryad));
    }
  });

  // ids are React keys and link targets (/cases?noun=…); a duplicate made the Words
  // search show the same card several times (эхэ and ехэ were both "ekhe").
  it('has a unique id for every entry', () => {
    const seen = new Map<string, string>();
    for (const e of vocab.entries) {
      expect(seen.get(e.id), `${e.id}: ${e.buryad} and ${seen.get(e.id)}`).toBeUndefined();
      seen.set(e.id, e.buryad);
    }
  });
});
