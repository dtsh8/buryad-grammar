// ─── Reader: from a word in running text to its vocabulary entry ──────────
// Curated glosses first, including every form the engines build for a headword, so хүдэлнэб
// finds хүдэлхэ. Words the vocabulary can't explain are looked up online: the Burlang dictionary
// first, then machine translation.

import { PERSON_ENDINGS } from '../data/grammar';
import type { Lexeme } from '../data/vocabulary.types';
import { readerGloss, type Lang } from '../i18n/lang';
import { decline } from './nounMorphology';
import {
  conjugate,
  extractRoot,
  getSufClass,
  sufC,
  translateFromBuryad,
  translateRussian,
} from './verbMorphology';

export interface ReaderIndex {
  entries: Map<string, Lexeme[]>;
  longestPhrase: number; // in words
}

export interface Token {
  text: string;
  key?: string; // set on words and phrases, not on the spaces and punctuation between them
}

const WORD = /[а-яёөүһѳ]+(?:-[а-яёөүһѳ]+)*/giu;

// Pasted text may use ѳ for ө, as ТСБЯ does.
export function wordKey(text: string): string {
  return text.toLowerCase().replace(/ѳ/g, 'ө');
}

// A headword without capitals or punctuation: "Сайн байна уу?" → "сайн байна уу".
function headwordKey(buryad: string): string {
  return wordKey(buryad)
    .replace(/[^а-яёөүһ\s-]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

// Personal endings go on predicates of any kind: хүдэлнэб, нэрэтэйб.
const ENDINGS = PERSON_ENDINGS.map(p => (p.suffix === '∅' ? '' : p.suffix.replace(/^-/, '')));

function withEndings(bases: string[]): string[] {
  return bases.flatMap(base => ENDINGS.map(ending => wordKey(base + ending)));
}

function paradigm(l: Lexeme): string[] {
  if (l.category === 'verb') return Object.values(conjugate(extractRoot(l.buryad)));
  if (l.category === 'noun') return Object.values(decline(l.buryad, l.nStem));
  return [];
}

export function buildIndex(lexicon: Lexeme[]): ReaderIndex {
  const entries = new Map<string, Lexeme[]>();

  // Each stage only takes spellings no earlier stage claimed, so the plainest reading wins:
  // нэрэтэйб is нэрэтэй + -б, not the comitative of нэрэ.
  const claim = (forms: (l: Lexeme) => string[]) => {
    const claimed = new Set(entries.keys());
    for (const l of lexicon) {
      for (const form of forms(l)) {
        if (claimed.has(form)) continue;
        const list = entries.get(form) ?? [];
        if (!list.includes(l)) entries.set(form, [...list, l]);
      }
    }
  };
  claim(l => [headwordKey(l.buryad)]);
  claim(l => withEndings([l.buryad]));
  claim(l => withEndings(paradigm(l)));

  const longestPhrase = Math.max(...[...entries.keys()].map(k => k.split(' ').length), 1);
  return { entries, longestPhrase };
}

// Splits text into words and what lies between them, keeping every character so it can be shown
// as typed. The longest vocabulary phrase wins: "Амар мэндэ" is one greeting, not two words.
export function tokenise(text: string, index: ReaderIndex): Token[] {
  const words = [...text.matchAll(WORD)];
  const tokens: Token[] = [];
  const start = (i: number) => words[i].index;
  const end = (i: number) => words[i].index + words[i][0].length;
  let pos = 0;

  for (let i = 0; i < words.length;) {
    let last = i;
    for (let n = Math.min(index.longestPhrase, words.length - i); n > 1; n--) {
      const candidate = words.slice(i, i + n).map(w => wordKey(w[0]));
      const onOneLine = candidate.every(
        (_, k) => k === 0 || /^ +$/.test(text.slice(end(i + k - 1), start(i + k)))
      );
      if (onOneLine && index.entries.has(candidate.join(' '))) {
        last = i + n - 1;
        break;
      }
    }
    if (start(i) > pos) tokens.push({ text: text.slice(pos, start(i)) });
    const surface = text.slice(start(i), end(last));
    tokens.push({ text: surface, key: wordKey(surface).replace(/ +/g, ' ') });
    pos = end(last);
    i = last + 1;
  }
  if (pos < text.length) tokens.push({ text: text.slice(pos) });
  return tokens;
}

export function lookup(key: string, index: ReaderIndex): Lexeme[] {
  return index.entries.get(key) ?? [];
}

// "to work (хүдэлхэ)": the headword is named only when the word on the page differs from it.
export function describe(key: string, hits: Lexeme[], lang: Lang): string {
  return hits
    .map(l => {
      const meaning = readerGloss(l, lang);
      return headwordKey(l.buryad) === key ? meaning : `${meaning} (${l.buryad})`;
    })
    .join('; ');
}

export interface OnlineGloss {
  text: string;
  source: 'burlang' | 'burlangMachine' | 'machine';
  lemma?: string; // the infinitive that was found, when the word on the page is a form of it
}

// The verb forms a word can be. The engine has no conditional, so it's added here (textbook
// converb table in grammar.ts; BNC: ябабал, хүдэлбэл).
function verbForms(root: string): string[] {
  const conditional = root + sufC(getSufClass(root), 'бал', 'бол', 'бэл');
  return [...Object.values(conjugate(root)), conditional];
}

const LONGEST_SUFFIX = 6; // letters: -даггүй

// The infinitives a word could come from: хэлэжэ → хэлэхэ, хүдэлнэб → хүдэлхэ. Each cut of the
// word's end gives a possible root, kept only if the engine builds the word from it again, so
// the verb rules live in one place. Whether the verb exists is for the dictionary to say.
export function verbInfinitives(word: string): string[] {
  const endings = ENDINGS.filter(ending => ending && word.endsWith(ending));
  const bases = [word, ...endings.map(ending => word.slice(0, -ending.length))];
  const found = new Set<string>();
  for (const base of bases) {
    for (let cut = 1; cut <= LONGEST_SUFFIX; cut++) {
      const stem = base.slice(0, -cut);
      if (!/[аоуэөүиыяеёю]/.test(stem)) break;
      // A short final vowel is lost before -аад and -аа; it agrees with the stem, or is и.
      for (const vowel of ['', getSufClass(stem), 'и']) {
        const root = stem + vowel;
        if (verbForms(root).includes(base)) found.add(conjugate(root).inf);
      }
    }
  }
  found.delete(word);
  return [...found];
}

const BURLANG = 'https://burlang.ru/api/v1/buryat-word/translate';
const BURLANG_TIMEOUT = 5000; // ms
const MAX_VERB_GUESSES = 3; // requests per word, on top of the word itself

// Burlang's entries can run to a paragraph of Buryad examples: keep the first sense.
// "1. 1) спокойный, благополучный; амар тайбан…" → "спокойный, благополучный"
export function firstSense(entry: string): string {
  return entry
    .replace(/^(\s*\d+[.)]?\s*)+/, '')
    .split(';')[0]
    .replace(/[.,:\s]+$/, '');
}

// Burlang has headwords only, in Russian, and answers 404 for a word it doesn't know.
async function burlangGloss(key: string): Promise<string | null> {
  const url = `${BURLANG}?q=${encodeURIComponent(key)}`;
  const resp = await fetch(url, { signal: AbortSignal.timeout(BURLANG_TIMEOUT) });
  if (!resp.ok) return null;
  const data = (await resp.json()) as { translations?: Array<{ value: string }> };
  const entry = data.translations?.[0]?.value;
  return entry ? firstSense(entry) : null;
}

// The word itself, then the verbs it may be a form of. One failed request ends the search, so a
// service that's down costs a single timeout.
async function burlangSearch(key: string): Promise<{ russian: string; lemma?: string } | null> {
  const russian = await burlangGloss(key);
  if (russian) return { russian };
  for (const lemma of verbInfinitives(key).slice(0, MAX_VERB_GUESSES)) {
    const verb = await burlangGloss(lemma);
    if (verb) return { russian: verb, lemma };
  }
  return null;
}

async function lookUpOnline(key: string, target: 'en' | 'ru'): Promise<OnlineGloss | null> {
  const entry = await burlangSearch(key).catch(() => null);
  if (entry) {
    const { russian, lemma } = entry;
    if (target === 'ru') return { text: russian, source: 'burlang', lemma };
    const english = await translateRussian(russian).catch(() => null);
    return english
      ? { text: english, source: 'burlangMachine', lemma }
      : { text: russian, source: 'burlang', lemma };
  }
  const text = await translateFromBuryad(key, target).catch(() => null);
  return text && wordKey(text) !== key ? { text, source: 'machine' } : null;
}

const translations = new Map<string, Promise<OnlineGloss | null>>();

// null when there's no translation: nothing found, the services failed, or machine translation
// handed the word back unchanged. These aren't kept, so hovering again retries.
export function translateWord(key: string, target: 'en' | 'ru'): Promise<OnlineGloss | null> {
  const id = `${target}:${key}`;
  const cached = translations.get(id);
  if (cached) return cached;
  const result = lookUpOnline(key, target).then(gloss => {
    if (!gloss) translations.delete(id);
    return gloss;
  });
  translations.set(id, result);
  return result;
}
