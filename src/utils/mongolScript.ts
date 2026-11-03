// The Old Mongolian (Uighur-Mongolian) script: Latin transliteration in, Unicode letters out, with
// each letter's position and the other sounds its shape can stand for there.
// Sources: Poppe N. Grammar of Written Mongolian. Wiesbaden, 1974 (§§ 60–101; § 98 is the table
// of shapes, § 101 the pairs that only a dictionary can tell apart).

export type Translit =
  | 'a'
  | 'e'
  | 'i'
  | 'o'
  | 'u'
  | 'ö'
  | 'ü'
  | 'n'
  | 'ng'
  | 'b'
  | 'p'
  | 'q'
  | 'γ'
  | 'k'
  | 'g'
  | 'm'
  | 'l'
  | 's'
  | 'š'
  | 't'
  | 'd'
  | 'č'
  | 'ǰ'
  | 'y'
  | 'r'
  | 'w'
  | 'f'
  | 'h'
  | 'z';

// Unicode letters. k and g are written with the letters of q and γ: the font picks the
// front-vowel shape from the word's vowels (Poppe § 76).
const CHAR: Record<Translit, string> = {
  a: 'ᠠ',
  e: 'ᠡ',
  i: 'ᠢ',
  o: 'ᠣ',
  u: 'ᠤ',
  ö: 'ᠥ',
  ü: 'ᠦ',
  n: 'ᠨ',
  ng: 'ᠩ',
  b: 'ᠪ',
  p: 'ᠫ',
  q: 'ᠬ',
  γ: 'ᠭ',
  k: 'ᠬ',
  g: 'ᠭ',
  m: 'ᠮ',
  l: 'ᠯ',
  s: 'ᠰ',
  š: 'ᠱ',
  t: 'ᠲ',
  d: 'ᠳ',
  č: 'ᠴ',
  ǰ: 'ᠵ',
  y: 'ᠶ',
  r: 'ᠷ',
  w: 'ᠸ',
  f: 'ᠹ',
  h: 'ᠾ',
  z: 'ᠽ',
};

// Rough modern reading in Cyrillic, for readers who know Buryad or Khalkha spelling.
export const CYRILLIC_HINT: Record<Translit, string> = {
  a: 'а',
  e: 'э',
  i: 'и',
  o: 'о',
  u: 'у',
  ö: 'ө',
  ü: 'ү',
  n: 'н',
  ng: 'ң',
  b: 'б',
  p: 'п',
  q: 'х',
  γ: 'г',
  k: 'х',
  g: 'г',
  m: 'м',
  l: 'л',
  s: 'с',
  š: 'ш',
  t: 'т',
  d: 'д',
  č: 'ч',
  ǰ: 'ж',
  y: 'й',
  r: 'р',
  w: 'в',
  f: 'ф',
  h: 'һ',
  z: 'з',
};

const VOWELS = new Set<Translit>(['a', 'e', 'i', 'o', 'u', 'ö', 'ü']);

// Longest spellings first, so "ng" wins over "n" and "sh" over "s".
const LATIN: Array<[string, Translit]> = [
  ['ng', 'ng'],
  ['sh', 'š'],
  ['ch', 'č'],
  ['gh', 'γ'],
  ['kh', 'q'],
  ['oe', 'ö'],
  ['ue', 'ü'],
  ['a', 'a'],
  ['e', 'e'],
  ['i', 'i'],
  ['ï', 'i'],
  ['o', 'o'],
  ['u', 'u'],
  ['ö', 'ö'],
  ['ü', 'ü'],
  ['n', 'n'],
  ['ŋ', 'ng'],
  ['b', 'b'],
  ['p', 'p'],
  ['q', 'q'],
  ['x', 'q'],
  ['γ', 'γ'],
  ['ɣ', 'γ'],
  ['ğ', 'γ'],
  ['k', 'k'],
  ['g', 'g'],
  ['m', 'm'],
  ['l', 'l'],
  ['s', 's'],
  ['š', 'š'],
  ['t', 't'],
  ['d', 'd'],
  ['č', 'č'],
  ['c', 'č'],
  ['ǰ', 'ǰ'],
  ['ĵ', 'ǰ'],
  ['j', 'ǰ'],
  ['y', 'y'],
  ['r', 'r'],
  ['w', 'w'],
  ['v', 'w'],
  ['f', 'f'],
  ['h', 'h'],
  ['z', 'z'],
];

export type Position = 'isolated' | 'initial' | 'medial' | 'final';

export interface Letter {
  sound: Translit;
  char: string;
  position: Position;
  // Other sounds written with the same shape in this position.
  alsoReads: Translit[];
  // Starts a suffix written apart (after a hyphen) or is the final a/e written apart.
  detached: boolean;
}

// A piece of a word: a run of letters, or the space-like mark that splits a suffix off.
export type Piece = { letter: Letter } | { joiner: string };

export interface ScriptWord {
  latin: string;
  pieces: Piece[];
}

export type ScriptToken = { word: ScriptWord } | { text: string };

// Narrow no-break space: a case suffix written apart from its word (Poppe § 88).
export const NNBSP = ' ';
// Mongolian vowel separator: the final a/e written apart (Poppe § 87).
export const MVS = '᠎';

const PUNCTUATION: Record<string, string> = { ',': '᠂', '.': '᠃', ':': '᠄' };

function parseLatin(word: string): Translit[] | null {
  const out: Translit[] = [];
  let rest = word.toLowerCase();
  while (rest) {
    // Poppe's non-syllabic ị: the second half of a diphthong, written yi inside a word (§ 92).
    if (rest[0] === 'ị') {
      out.push(...(rest.length > 1 ? (['y', 'i'] as const) : (['i'] as const)));
      rest = rest.slice(1);
      continue;
    }
    const hit = LATIN.find(([spelling]) => rest.startsWith(spelling));
    if (!hit) return null;
    out.push(hit[1]);
    rest = rest.slice(hit[0].length);
  }
  return out;
}

// Which sounds share the letter's shape here (Poppe §§ 72–76, 98, 101). `firstSyllable` matters
// for ö and ü, which lose their extra tooth after the first syllable.
function alsoReads(
  sound: Translit,
  position: Position,
  next: Translit | undefined,
  firstSyllable: boolean,
  detached: boolean
): Translit[] {
  const beforeVowel = next !== undefined && VOWELS.has(next);
  const beforeConsonant = next !== undefined && !beforeVowel;
  const end = position === 'final' || position === 'isolated';
  const mid = position === 'medial';
  const roundBack: Translit[] = ['o', 'u'];
  const roundFront: Translit[] = ['ö', 'ü'];
  const others = (list: Translit[]) => list.filter(s => s !== sound);

  switch (sound) {
    case 'a':
    case 'e':
      if (detached) return others(['a', 'e']);
      if (mid || end) return others(['a', 'e', 'n']);
      return [];
    case 'n':
      if (beforeVowel) return []; // dotted before vowels
      if (mid || end) return ['a', 'e'];
      return [];
    case 'i':
      return mid ? ['y'] : [];
    case 'y':
      if (position === 'initial') return ['ǰ'];
      return mid ? ['i'] : [];
    case 'ǰ':
      return position === 'initial' ? ['y'] : [];
    case 'o':
    case 'u':
      if ((mid && !firstSyllable) || end) return others([...roundBack, ...roundFront]);
      return others(roundBack);
    case 'ö':
    case 'ü':
      if (position === 'initial' || (mid && firstSyllable)) return others(roundFront);
      return others([...roundBack, ...roundFront]);
    case 't':
      return end ? [] : ['d'];
    case 'd':
      // d before a consonant and at the end has shapes of its own (§ 73).
      return end || beforeConsonant ? [] : ['t'];
    case 'k':
      return ['g'];
    case 'g':
      return end ? [] : ['k'];
    case 'q':
      return mid ? ['γ'] : [];
    case 'γ':
      // Dotted before vowels; undotted before a consonant it looks like medial q (§ 98).
      return mid && beforeConsonant ? ['q'] : [];
    case 's':
      return next === 'i' ? ['š'] : [];
    case 'š':
      return next === 'i' ? ['s'] : []; // the dots are left off before i (§ 72)
    default:
      return [];
  }
}

// One word in transliteration, e.g. "kümün-ü", "suruγ-a", "bayši". A hyphen before a lone final
// a/e writes the vowel apart; any other hyphen starts a separately written suffix.
export function scriptWord(latin: string): ScriptWord | null {
  const parts = latin.split('-');
  const pieces: Piece[] = [];
  let syllables = 0;
  for (let p = 0; p < parts.length; p++) {
    const sounds = parseLatin(parts[p]);
    if (!sounds || sounds.length === 0) return null;
    const lastPart = p === parts.length - 1;
    const vowelApart = p > 0 && lastPart && sounds.length === 1 && /^[ae]$/.test(sounds[0]);
    if (p > 0) pieces.push({ joiner: vowelApart ? MVS : NNBSP });
    sounds.forEach((sound, i) => {
      const next = sounds[i + 1] ?? (lastPart ? undefined : parsePeek(parts[p + 1]));
      let position: Position;
      if (sounds.length === 1) position = p === 0 ? 'isolated' : 'final';
      else if (i === 0)
        position = p === 0 ? 'initial' : 'medial'; // suffix vowels: § 88
      else if (i === sounds.length - 1) position = 'final';
      else position = 'medial';
      // A consonant opening a suffix takes its initial shape.
      if (p > 0 && i === 0 && !VOWELS.has(sound) && sounds.length > 1) position = 'initial';
      const firstSyllable = syllables === 0;
      if (VOWELS.has(sound)) syllables++;
      const detached = p > 0 && i === 0;
      pieces.push({
        letter: {
          sound,
          char: CHAR[sound],
          position,
          alsoReads: alsoReads(sound, position, next, firstSyllable, vowelApart),
          detached,
        },
      });
    });
  }
  return { latin, pieces };
}

function parsePeek(part: string | undefined): Translit | undefined {
  return part ? parseLatin(part)?.[0] : undefined;
}

// Unicode text of a word, ready for a Mongolian font.
export function wordText(word: ScriptWord): string {
  return word.pieces.map(p => ('letter' in p ? p.letter.char : p.joiner)).join('');
}

// A whole line of transliteration. Words that aren't transliteration are kept as they are.
export function scriptTokens(latin: string): ScriptToken[] {
  const tokens: ScriptToken[] = [];
  for (const chunk of latin.match(/[^\s,.:;?!]+|[\s]+|[,.:;?!]/g) ?? []) {
    if (/^\s+$/.test(chunk)) tokens.push({ text: ' ' });
    else if (chunk in PUNCTUATION) tokens.push({ text: PUNCTUATION[chunk] });
    else {
      const word = scriptWord(chunk);
      tokens.push(word ? { word } : { text: chunk });
    }
  }
  return tokens;
}

export const hasCyrillic = (text: string) => /[Ѐ-ӿ]/.test(text);

const BACK = /[аоуыяёю]/;
const CYR_VOWEL = /[аэиоуыөүяеёю]/;
const LONG: Record<string, string> = {
  аа: 'aγa',
  оо: 'oγo',
  уу: 'uγu',
  ээ: 'ege',
  өө: 'öge',
  үү: 'ügü',
  ии: 'i',
  ыы: 'i',
};
const SHORT: Record<string, string> = {
  а: 'a',
  э: 'e',
  и: 'i',
  ы: 'i',
  о: 'o',
  у: 'u',
  ө: 'ö',
  ү: 'ü',
};
const CONSONANT: Record<string, string> = {
  б: 'b',
  в: 'w',
  д: 'd',
  ж: 'ǰ',
  з: 'ǰ',
  л: 'l',
  м: 'm',
  н: 'n',
  ң: 'ng',
  п: 'p',
  р: 'r',
  т: 't',
  ф: 'f',
  // Buryad һ goes back to s (grammar.ts, ablative note), and Buryad с to č, as in the pairs
  // below: һара ~ sara, уһан ~ usun, сагаан ~ čaγan.
  һ: 's',
  с: 'č',
  ц: 'č',
  ч: 'č',
  ш: 'š',
  щ: 'š',
};

// Words of the app's vocabulary whose written form Poppe gives, with his section. The page shows
// them to explain why spelling by sound goes wrong, and the converter uses them as they are.
export const KNOWN_SPELLINGS: Array<{ buryad: string; latin: string; poppe: string }> = [
  { buryad: 'хүн', latin: 'kümün', poppe: '§ 443' },
  { buryad: 'һара', latin: 'sara', poppe: '§ 71' },
  { buryad: 'уһан', latin: 'usun', poppe: '§ 71' },
  { buryad: 'шара', latin: 'sira', poppe: '§ 102' },
  { buryad: 'уула', latin: 'aγula', poppe: '§ 102' },
  { buryad: 'сагаан', latin: 'čaγan', poppe: '§ 42' },
  { buryad: 'модон', latin: 'modun', poppe: '§ 102' },
  { buryad: 'морин', latin: 'morin', poppe: '§ 443' },
  { buryad: 'сэсэг', latin: 'čečeg', poppe: '§ 127' },
  { buryad: 'эхэ', latin: 'eke', poppe: '§ 20' },
  { buryad: 'үгэ', latin: 'üge', poppe: '§ 443' },
  { buryad: 'гэр', latin: 'ger', poppe: '§ 101' },
  { buryad: 'ном', latin: 'nom', poppe: '§ 407' },
  { buryad: 'би', latin: 'bi', poppe: '§ 443' },
];

const KNOWN = new Map(KNOWN_SPELLINGS.map(w => [w.buryad, w.latin]));

// Buryad Cyrillic → transliteration, by sound. The old script keeps older spellings (хүн is
// kümün), so apart from the words above this is a first guess to correct, not a dictionary.
// Long vowels are written the way they most often arose (aγa, ege …: Poppe § 102.3) and я after
// a consonant as iya (§ 102.4).
export function cyrillicToLatin(text: string): string {
  return text.replace(/[Ѐ-ӿ]+/g, word => {
    const lower = word.toLowerCase();
    return KNOWN.get(lower) ?? convertWord(lower);
  });
}

function convertWord(word: string): string {
  const back = BACK.test(word);
  let out = '';
  for (let i = 0; i < word.length; i++) {
    const c = word[i];
    const pair = word.slice(i, i + 2);
    const prev = word[i - 1];
    const afterConsonant = prev !== undefined && !CYR_VOWEL.test(prev) && !/[ьъй]/.test(prev);
    const next = word[i + 1];
    if (c === 'й') {
      // ай, эй …: a diphthong, written ayi inside a word and ai at its end (Poppe § 92).
      out += next && !CYR_VOWEL.test(next) ? 'yi' : 'i';
    } else if (pair in LONG) {
      out += LONG[pair];
      i++;
    } else if (c in SHORT) {
      out += SHORT[c];
    } else if (c === 'я' || c === 'е' || c === 'ё' || c === 'ю') {
      const vowel = { я: 'a', е: 'e', ё: 'o', ю: back ? 'u' : 'ü' }[c];
      out += afterConsonant ? `iy${vowel}` : `y${vowel}`;
      if (next === c || (c === 'я' && next === 'а')) i++; // яа: one long vowel
    } else if (c === 'г') {
      out += back ? 'γ' : 'g';
    } else if (c === 'х' || c === 'к') {
      out += back ? 'q' : 'k';
    } else if (c in CONSONANT) {
      out += CONSONANT[c];
    }
    // ь and ъ are not written.
  }
  return out;
}
