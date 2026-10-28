import { describe, expect, it } from 'vitest';
import type { VocabularyData } from './vocabulary.types';
import vocabJson from '../../public/data/vocabulary.json';

const vocab = vocabJson as VocabularyData;

describe('vocabulary.json', () => {
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
