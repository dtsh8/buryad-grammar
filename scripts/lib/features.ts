// ─── Grammar features matched in corpus sentences ─────────────────────────
// Each feature is recognised by a word ending. There is no Buryad morphological
// parser, so matching is by suffix, with three guards against false hits:
//   • the stem before the suffix must be at least two letters;
//   • finite verb forms are matched only as the sentence's last word (Buryad is
//     verb-final), skipping trailing particles such as юм, ха, гү;
//   • a stop list drops frequent words that only look like the form (буряад ≠ -аад).
// Suffix sets follow src/data/grammar.ts; the ids are referenced from there.

import { LETTER } from './text.ts';

export interface Feature {
  id: string;
  label: string;
  description: string;
  word?: RegExp; // tested against the lower-cased word
  final?: boolean; // only the sentence's last word counts
  sentence?: RegExp; // alternative: a sentence-level pattern; group 1 is the match
  stop?: string[];
}

const L = `[${LETTER}]`;
const STEM = `^${L}{2,}`;
const PERSON = '(б|ш|бди|т|д)?';

// Particles that may follow a sentence-final verb.
const TRAILING = new Set(['юм', 'ха', 'гү', 'гүш', 'гүт', 'даа', 'лэ', 'ла', 'бэлэй', 'байна']);

const re = (body: string) => new RegExp(`${STEM}${body}$`);

export const FEATURES: Feature[] = [
  // ── Cases ────────────────────────────────────────────────────────────────
  {
    id: 'case_genitive',
    label: 'Genitive case',
    description: '-ын / -иин after vowels',
    word: re('(ын|иин|ийн)'),
  },
  {
    id: 'case_dative',
    label: 'Dative-locative case',
    description: '-да / -та after a consonant',
    word: re('[бвгджзклмнпрстфхцчшщ](да|дэ|до|та|тэ|то)'),
    stop: ['хамта', 'зэргэтэ', 'урда', 'дунда', 'нягта', 'һүлдэ'],
  },
  {
    id: 'case_accusative',
    label: 'Accusative case',
    description: '-ые / -иие / -гые',
    word: re('(ые|иие|гые)'),
  },
  {
    id: 'case_instrumental',
    label: 'Instrumental case',
    description: '-аар / -ээр / -оор / -өөр',
    word: re('(аар|ээр|оор|өөр)'),
    stop: ['нээрээр'],
  },
  {
    id: 'case_comitative',
    label: 'Comitative case',
    description: '-тай / -тэй / -той',
    word: re('(тай|тэй|той)'),
  },
  {
    id: 'case_ablative',
    label: 'Ablative case',
    description: '-һаа / -һээ / -һоо / -һөө',
    word: re('(һаа|һээ|һоо|һөө)'),
  },

  // ── Finite verb forms (sentence-final) ───────────────────────────────────
  {
    id: 'verb_present',
    label: 'Present-future',
    description: '-на / -нэ / -но',
    word: re(`(на|нэ|но)${PERSON}`),
    final: true,
  },
  {
    id: 'verb_past',
    label: 'Simple past',
    description: '-ба / -бэ / -бо',
    word: re(`(ба|бэ|бо)${PERSON}`),
    final: true,
  },
  {
    id: 'verb_perfect',
    label: 'Perfect',
    description: '-аа / -ээ / -оо / -өө',
    word: re('(аа|ээ|оо|өө|яа|еэ)(б|ш|бди|т)?'),
    final: true,
  },
  {
    id: 'verb_past_participle',
    label: 'Past participle',
    description: '-һан / -һэн / -һон',
    word: re('(һан|һэн|һон)'),
    final: true,
  },
  {
    id: 'verb_resultative',
    label: 'Resultative',
    description: '-нхай / -нхэй / -нхой',
    word: re(`(нхай|нхэй|нхой)${PERSON}`),
  },
  {
    id: 'verb_habitual',
    label: 'Habitual',
    description: '-даг / -дэг / -дог',
    word: re(`(даг|дэг|дог)${PERSON}`),
  },
  {
    id: 'verb_negation',
    label: 'Negation',
    description: '-гүй after a verb form',
    word: re(`(даг|дэг|дог|аа|ээ|оо|өө|ха|хэ|хо|на|нэ|но|ба|бэ|бо)гүй${PERSON}`),
  },

  // ── Converbs ────────────────────────────────────────────────────────────
  {
    id: 'converb_simultaneous',
    label: 'Simultaneous converb',
    description: '-жа / -жэ / -жо',
    word: re('(жа|жэ|жо)'),
    stop: ['гэжэ', 'тиигэжэ', 'юрэжэ'],
  },
  {
    id: 'converb_sequential',
    label: 'Sequential converb',
    description: '-аад / -ээд / -оод / -өөд',
    word: re('(аад|ээд|оод|өөд|яад|еэд|ёод)'),
    // Numerals in -аад "about N" and the adverb нилээд look like converbs.
    stop: [
      'буряад',
      'нилээд',
      'арбаад',
      'хорёод',
      'гушаад',
      'дүшөөд',
      'табяад',
      'жаранаад',
      'далаад',
      'наяад',
    ],
  },
  {
    id: 'converb_conditional',
    label: 'Conditional converb',
    description: '-бал / -бэл / -бол',
    word: re('(бал|бэл|бол)'),
    stop: ['волейбол', 'футбол', 'баскетбол', 'гандбол', 'хоккей', 'цыренбал', 'жамбал', 'гомбол'],
  },
  {
    id: 'converb_concessive',
    label: 'Concessive',
    description: '-башье, or -аа + шье һаа',
    sentence: new RegExp(`(${L}{2,}(?:башье|бэшье|бошье)|${L}{2,}(?:аа|ээ|оо|өө)шье\\s+һаа)`, 'i'),
  },

  // ── Voice ───────────────────────────────────────────────────────────────
  {
    id: 'deriv_passive',
    label: 'Passive',
    description: '-гда / -гдэ / -гдо',
    // At least one letter after -гда, so place names in -гда (Петербургда) don't match.
    word: new RegExp(`${STEM}(гда|гдэ|гдо|гдө)${L}+$`),
  },
  // No reciprocal -лда feature: in news text -лд- is mostly a л-noun + dative + reflexive
  // (үбэлдөө) or a lexical stem (бэлдэ-, худалда-), so suffix matching finds almost no real ones.
  {
    id: 'deriv_cooperative',
    label: 'Cooperative',
    description: '-лса / -лсэ / -лсо',
    word: re(
      'лс(аха|эхэ|охо|ана|энэ|оно|аба|эбэ|обо|ажа|эжэ|ожо|аа|ээ|оо|өө|аад|ээд|оод|өөд|аһан|эһэн|оһон|адаг|эдэг|одог)'
    ),
  },
];

const WORDS = new RegExp(`[${LETTER}]+`, 'g');

// The word in `sentence` that shows the feature, or null.
export function findMatch(sentence: string, f: Feature): string | null {
  if (f.sentence) return sentence.match(f.sentence)?.[1] ?? null;
  const words = sentence.match(WORDS) ?? [];
  const ok = (w: string) => f.word!.test(w.toLowerCase()) && !f.stop?.includes(w.toLowerCase());
  if (f.final) {
    let i = words.length - 1;
    while (i > 0 && TRAILING.has(words[i].toLowerCase())) i--;
    return words[i] && ok(words[i]) ? words[i] : null;
  }
  return words.find(ok) ?? null;
}
