import { CASES, POSSESSIVE_SUFFIXES, VERB_PARADIGMS, VOWELS } from '../data/grammar';
import { PARADIGM_FORMS, PARADIGM_NOUN } from '../data/caseParadigm';
import type { Lexeme } from '../data/vocabulary.types';
import { clipKey } from './audio';

export interface InventoryItem {
  key: string; // clip file name without extension
  word: string; // as shown in the app
  gloss: string;
  where: string[]; // pages/sections showing a play button for it
}

// Every word the app shows a play button for, in the order of the recording checklist.
// A word used in several places is listed once, with all its places.
export function audioInventory(vocabulary: Lexeme[]): InventoryItem[] {
  const items = new Map<string, InventoryItem>();
  const add = (word: string, gloss: string, where: string) => {
    const key = clipKey(word);
    const item = items.get(key);
    if (!item) items.set(key, { key, word, gloss, where: [where] });
    else if (!item.where.includes(where)) item.where.push(where);
  };

  for (const v of VOWELS) add(v.example.word, v.example.meaning, 'Phonology · vowels');
  for (const f of PARADIGM_FORMS)
    add(f.form, `${PARADIGM_NOUN.meaning} (${f.case_.toLowerCase()})`, 'Cases · paradigm');
  for (const c of CASES)
    for (const ex of c.examples) add(ex.inflected, ex.translation, `Cases · ${c.english}`);
  for (const p of POSSESSIVE_SUFFIXES) add(p.example, p.translation, 'Cases · possessives');
  for (const vp of VERB_PARADIGMS)
    for (const [form, value] of Object.entries(vp.forms))
      add(value, `${vp.meaning} (${form})`, 'Verbs · conjugator');
  for (const l of vocabulary) add(l.buryad, l.english, 'Vocabulary');

  return [...items.values()];
}
