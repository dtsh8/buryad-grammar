import { describe, expect, it } from 'vitest';
import type { AttestationData } from '../data/attestation.types';
import type { VocabularyData } from '../data/vocabulary.types';
import vocabJson from '../../public/data/vocabulary.json';
import attestationJson from '../../public/data/attestation.json';
import { attestationForms, attestationKey } from './attestationForms';

const vocab = vocabJson as VocabularyData;
const attestation = attestationJson as AttestationData;

describe('attestation counts', () => {
  const forms = attestationForms(vocab.entries);

  // Fails after a vocabulary or engine change until `npm run attestation` is run.
  it('cover every form the app builds for its vocabulary', () => {
    const missing = forms.filter(f => !(f in attestation.counts));
    expect(missing, 'run: npm run attestation').toEqual([]);
  });

  it('are non-negative token counts', () => {
    for (const [f, n] of Object.entries(attestation.counts)) {
      expect(Number.isInteger(n) && n >= 0, f).toBe(true);
    }
  });

  it('agree with forms checked by hand (Buryat National Corpus)', () => {
    expect(attestation.counts['эдеэд']).toBe(154);
    expect(attestation.counts['эдеэгээд'] ?? 0).toBe(0);
    expect(attestation.counts['мориие']).toBeGreaterThan(0);
  });

  it('look up phrases by their last word', () => {
    expect(attestationKey('галта тэргээр')).toBe('тэргээр');
    expect(attestationKey('  Хүниие ')).toBe('хүниие');
  });
});
