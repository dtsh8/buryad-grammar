// ─── Text cleaning and splitting for the burunen.ru corpus ────────────────

// Buryad letters on top of the Russian alphabet: ү Ү ө Ө һ Һ.
export const LETTER = 'а-яёА-ЯЁүҮөӨһҺ';
const WORD = new RegExp(`[${LETTER}]+`, 'g');

// Latin letters that burunen.ru types in place of Buryad ones. The site writes
// Latin h for һ in many articles (гэhэн, hургуули); the old scraper deleted it.
const LOOKALIKE: Record<string, string> = {
  h: 'һ',
  H: 'Һ',
  ö: 'ө',
  Ö: 'Ө',
  ü: 'ү',
  Ü: 'Ү',
};

// Inside a Cyrillic word, also map Latin letters that look like Cyrillic ones.
const HOMOGLYPH: Record<string, string> = {
  a: 'а',
  e: 'е',
  o: 'о',
  p: 'р',
  c: 'с',
  x: 'х',
  y: 'у',
  A: 'А',
  E: 'Е',
  O: 'О',
  P: 'Р',
  C: 'С',
  X: 'Х',
  B: 'В',
  H: 'Н',
  K: 'К',
  M: 'М',
  T: 'Т',
};

// Fix a word that mixes Latin and Cyrillic letters. Purely Latin words are left alone.
function fixWord(word: string): string {
  if (!new RegExp(`[${LETTER}]`).test(word)) return word;
  return [...word].map(ch => LOOKALIKE[ch] ?? HOMOGLYPH[ch] ?? ch).join('');
}

// Clean scraped article text: repair mixed-script words, keep digits and
// punctuation, drop everything else that is neither Cyrillic nor Latin.
export function normaliseText(raw: string): string {
  return raw
    .replace(/[A-Za-zÀ-ÿА-яЁёҮүӨөҺһ]+/g, fixWord)
    .replace(new RegExp(`[^${LETTER}A-Za-z0-9\\s.,!?;:()%№"«»—–\\-]`, 'g'), '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(text: string): string[] {
  return (text.match(WORD) ?? []).map(w => w.toLowerCase());
}

// Sentence boundary: . ! ? or » followed by a capital letter.
export function splitSentences(text: string): string[] {
  return text
    .split(new RegExp(`(?<=[.!?»])\\s+(?=[А-ЯЁҮӨҺ«"])`))
    .map(s => s.trim())
    .filter(s => s.length >= 25 && s.length <= 400 && new RegExp(`[${LETTER}]{3}`).test(s));
}
