// ─── Forms checked against the Buryat National Corpus ─────────────────────
// Every word form the app builds for its own vocabulary: verb paradigms and derived voices
// (Verb Builder), noun cases (declension table, Practice) and the curated case examples.
// scripts/attestation.ts counts these in the corpus; the test keeps the counts file complete.

import type { Lexeme } from '../data/vocabulary.types';
import { PERSON_ENDINGS } from '../data/grammar';
import { conjugate, deriveAll, extractRoot } from './verbMorphology';
import { decline } from './nounMorphology';
import { caseItems } from './practice';

// The word a count is kept for: lower-cased, and the last word of a phrase
// (галта тэргээр → тэргээр), since only that word carries the ending.
export function attestationKey(form: string): string {
  return form.trim().toLowerCase().split(/\s+/).at(-1) ?? '';
}

export function attestationForms(lexicon: Lexeme[]): string[] {
  const forms: string[] = [];
  for (const l of lexicon) {
    if (l.category === 'verb') {
      const root = extractRoot(l.buryad);
      const c = conjugate(root);
      forms.push(...Object.values(c));
      // Practice conjugation answers: present, -ба past and perfect + person ending
      for (const p of PERSON_ENDINGS) {
        const ending = p.suffix === '∅' ? '' : p.suffix.replace(/^-/, '');
        forms.push(c.prs + ending, c.pst + ending);
        if (p.perfect) forms.push(c.perf + ending);
      }
      for (const d of deriveAll(root, 'x')) forms.push(d.inf, d.prs, d.pst, d.neg);
    } else if (l.category === 'noun') {
      forms.push(...Object.values(decline(l.buryad, l.nStem)));
    }
  }
  for (const item of caseItems()) forms.push(item.stem, item.form);
  return [...new Set(forms.map(attestationKey).filter(w => /^[а-яёөүһ]+$/.test(w)))].sort();
}
