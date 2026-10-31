import { describe, expect, it } from 'vitest';
import { MODAL_CORNERS, MODAL_ENTRIES } from './grammar';

describe('modal words', () => {
  it('pairs each corner of the square with the corner that negates it', () => {
    const byId = new Map(MODAL_CORNERS.map(c => [c.id, c]));
    for (const corner of MODAL_CORNERS) {
      expect(byId.get(corner.opposite)?.opposite).toBe(corner.id);
    }
  });

  it('gives every modal word a sourced example and negative', () => {
    for (const entry of MODAL_ENTRIES) {
      expect(entry.negatives.length, entry.word).toBeGreaterThan(0);
      for (const example of [entry.example, ...entry.negatives]) {
        expect(example.source, example.buryad).not.toBe('');
      }
    }
  });
});
