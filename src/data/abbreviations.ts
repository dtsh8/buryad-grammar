// Explanations of the linguists' abbreviations on the Word Order and Phonology pages, shown as
// tooltips: S/O/V word-order labels and C/V syllable patterns.

// Dotted underline for an abbreviation inside running text, so it reads as tappable.
export const ABBR_CLASS = 'underline decoration-dotted decoration-stone-400 underline-offset-4';

export const ORDER_TIP: Record<string, string> = {
  S: 'S = subject: who or what does the action. Би "I" in Би ном уншана "I read a book".',
  O: 'O = object: what the action is done to. ном "book" in Би ном уншана.',
  V: 'V = verb: the action. уншана "read(s)" in Би ном уншана. In Buryad it comes last.',
  'O₂/Adv':
    'O₂ = a second object; Adv = adverbial: when, where or how (мүнөө "now", гэртэ "at home"). They go between the subject and the verb.',
  SOV: 'SOV = Subject–Object–Verb: the verb comes last. Би ном уншана, word for word "I book read".',
  SVO: 'SVO = Subject–Verb–Object: the verb comes between subject and object, as in English "I read a book".',
};

export const SYLLABLE_TIP: Record<string, string> = {
  formula:
    'C = consonant, V = vowel; brackets mark optional parts. Every syllable has one vowel, with up to two consonants before it and up to two after.',
  sigma: 'σ (Greek sigma) is the linguists’ symbol for a syllable.',
  CVC: 'CVC = consonant + vowel + consonant, one syllable: г + э + р.',
  'V.CV': 'V.CV = two syllables (the dot is the boundary): a vowel, а, then consonant + vowel, ха.',
  'V.CVC':
    'V.CVC = two syllables (the dot is the boundary): a vowel, у, then consonant + vowel + consonant, һан.',
};
