// ─── Buryad (Буряад) Language Grammar Data ────────────────────────────────
// Sources: Poppe (1960), Skribnik & Sesenova (2006), Vladimircov (1929),
//          WALS feature data, ISO 639-3: bua (Buriat)

export const LANGUAGE_META = {
  name: { buryad: 'Буряад хэлэн', russian: 'Бурятский язык', english: 'Buryat' },
  family: 'Mongolic → Central Mongolic',
  iso: 'bua',
  speakers: 461000,
  scripts: ['Cyrillic (since 1939)', 'Old Mongolian (historical)', 'Latin (1929–1939)'],
  regions: ['Buryatia, Russia', 'Mongolia', 'Inner Mongolia, China'],
  typology: {
    wordOrder: 'SOV',
    morphologicalType: 'Agglutinative',
    caseMarking: 'Nominative–Accusative (with ergative tendencies)',
    alignment: 'Nominative–Accusative',
  },
} as const;

// ─── Phonology ────────────────────────────────────────────────────────────

export type VowelHarmonyGroup = 'back' | 'front' | 'neutral';

export interface Vowel {
  letter: string;
  long: string;
  ipa: string;
  harmony: VowelHarmonyGroup;
  height: 'high' | 'mid' | 'low';
  backness: 'front' | 'central' | 'back';
  rounded: boolean;
  example: { word: string; meaning: string };
  how: string; // how to say it, for the Phonology page
}

// `how` notes: the textbook says letters shared with Russian keep their Russian sound (p. 1) and
// describes у, ү, өө itself (p. 2); wide/narrow and rounding from p. 3. Its comparisons to
// Russian disagree with the [u], [y], [ø] below: see question C4.
export const VOWELS: Vowel[] = [
  {
    letter: 'а',
    long: 'аа',
    ipa: 'a',
    harmony: 'back',
    height: 'low',
    backness: 'back',
    rounded: false,
    example: { word: 'аха', meaning: 'elder brother' },
    how: 'Mouth wide open, lips relaxed. As Russian а.',
  },
  {
    letter: 'о',
    long: 'оо',
    ipa: 'ɔ',
    harmony: 'back',
    height: 'mid',
    backness: 'back',
    rounded: true,
    example: { word: 'ном', meaning: 'book' },
    how: 'Lips rounded, mouth wide open. As Russian о.',
  },
  {
    letter: 'у',
    long: 'уу',
    ipa: 'u',
    harmony: 'back',
    height: 'high',
    backness: 'back',
    rounded: true,
    example: { word: 'уһан', meaning: 'water' },
    how: 'Lips come close together and push forward a little, leaving a narrow slit, while the back of the tongue rises and pulls back. Sounds between Russian о and у.',
  },
  {
    letter: 'э',
    long: 'ээ',
    ipa: 'e',
    harmony: 'front',
    height: 'mid',
    backness: 'front',
    rounded: false,
    example: { word: 'эхэ', meaning: 'mother' },
    how: 'Mouth wide open, lips unrounded. As Russian э.',
  },
  {
    letter: 'ө',
    long: 'өө',
    ipa: 'ø',
    harmony: 'front',
    height: 'mid',
    backness: 'front',
    rounded: true,
    example: { word: 'өөдэ', meaning: 'upward' },
    how: 'Always long, so always written өө. Lips rounded, wider than for ү; tongue slightly raised and pulled back. Close to Russian о.',
  },
  {
    letter: 'ү',
    long: 'үү',
    ipa: 'y',
    harmony: 'front',
    height: 'high',
    backness: 'front',
    rounded: true,
    example: { word: 'үнэн', meaning: 'truth' },
    how: 'Lips rounded, tongue high: the tip draws back from the teeth and the root moves forward. Very close to Russian у, as in улица.',
  },
  {
    letter: 'и',
    long: 'ии',
    ipa: 'i',
    harmony: 'neutral',
    height: 'high',
    backness: 'central',
    rounded: false,
    example: { word: 'иимэ', meaning: 'such' }, // textbook p. 4
    how: 'Lips unrounded, mouth narrow. As Russian и. Long и is written ии or, without softening the consonant before it, ы.', // ы: K&K p. 28
  },
];

export const VOWEL_HARMONY_PAIRS: Array<[string, string]> = [
  ['а', 'э'],
  ['о', 'ө'],
  ['у', 'ү'],
];

export type ConsonantPlace =
  'bilabial' | 'alveolar' | 'postalveolar' | 'palatal' | 'velar' | 'pharyngeal';

export interface Consonant {
  letter: string;
  ipa: string;
  place: ConsonantPlace;
  manner: string;
  voiced: boolean;
  how: string; // how to say it, for the Phonology page
  // A positional pronunciation; `note` says where it is reported.
  allophone?: { ipa: string; note: string };
}

// `how` notes: letters shared with Russian keep their Russian sound (textbook p. 1); һ is
// pharyngeal, voiceless at the start of a word and voiced inside it (p. 2); н has a front and a
// back sound with one letter (p. 3); к, п only in loanwords, й only inside a word (K&K p. 27).
// г and х shift with harmony: Staroverov 2020, p. 46; Radnaeva 2006, p. 582.
export const CONSONANTS: Consonant[] = [
  {
    letter: 'б',
    ipa: 'b',
    place: 'bilabial',
    manner: 'plosive',
    voiced: true,
    how: 'Both lips close, with voice. As Russian б at the start of a word; lighter later in the word.',
    allophone: {
      ipa: 'β',
      note: 'Vowel harmony plays no part: it depends on the neighbouring sounds. б is a full [b] at the start of a word, as in Russian and English. Later in a word it lightens to [β], close to English w: before г in баабгай, and between vowels in ябаха and ябаба. So баабгай has both sounds. A native speaker reports this; Radnaeva (2006) also writes [β] in хабар and ябадаг, and [p] before т in добтолдог.',
    },
  },
  {
    letter: 'п',
    ipa: 'p',
    place: 'bilabial',
    manner: 'plosive',
    voiced: false,
    how: 'Both lips close, no voice. As Russian п. Found in loanwords.',
  },
  {
    letter: 'д',
    ipa: 'd',
    place: 'alveolar',
    manner: 'plosive',
    voiced: true,
    how: 'Tongue tip at the upper front teeth, with voice. As Russian д.',
  },
  {
    letter: 'т',
    ipa: 't',
    place: 'alveolar',
    manner: 'plosive',
    voiced: false,
    how: 'Tongue tip at the upper front teeth, no voice. As Russian т.',
  },
  {
    letter: 'г',
    ipa: 'ɡ',
    place: 'velar',
    manner: 'plosive',
    voiced: true,
    how: 'Back of the tongue against the palate, with voice. In front-vowel words as Russian г; in back-vowel words made much further back.',
    allophone: {
      ipa: 'ɢ, ʁ',
      note: 'г follows the vowel harmony of the word (Staroverov 2020, p. 46). In back-vowel words it is uvular [ɢ], as in гараад and газарта, and between vowels it often softens to the fricative [ʁ]; Radnaeva (2006) has [ʁ] after р in гаргаад. In front-vowel words it is [g], as in гээшэ, and sometimes softens to [ɣ], as in гүлгэ.',
    },
  },
  {
    letter: 'к',
    ipa: 'k',
    place: 'velar',
    manner: 'plosive',
    voiced: false,
    how: 'Back of the tongue against the palate, no voice. As Russian к. Found in loanwords.',
  },
  {
    letter: 'з',
    ipa: 'z',
    place: 'alveolar',
    manner: 'fricative',
    voiced: true,
    how: 'Air hisses past the tongue tip, with voice. As Russian з.',
  },
  {
    letter: 'с',
    ipa: 's',
    place: 'alveolar',
    manner: 'fricative',
    voiced: false,
    how: 'Air hisses past the tongue tip, no voice. As Russian с.',
  },
  {
    letter: 'ж',
    ipa: 'dʒ',
    place: 'postalveolar',
    manner: 'affricate',
    voiced: true,
    how: 'The textbook gives it the sound of Russian ж. The /dʒ/ shown here, like English j, is unconfirmed.',
  },
  {
    letter: 'ш',
    ipa: 'ʃ',
    place: 'postalveolar',
    manner: 'fricative',
    voiced: false,
    how: 'Tongue raised just behind the teeth ridge, no voice. As Russian ш.',
  },
  {
    letter: 'х',
    ipa: 'x',
    place: 'velar',
    manner: 'fricative',
    voiced: false,
    how: 'Air rasps between the back of the tongue and the palate, no voice. As Russian х in front-vowel words; further back and harsher in back-vowel words.',
  },
  {
    letter: 'һ',
    ipa: 'h',
    place: 'pharyngeal',
    manner: 'fricative',
    voiced: false,
    how: 'Made deep in the throat, between the tongue root and the back wall. Voiceless at the start of a word (һайн, һанаан). Voiced inside a word (уһан), close to Ukrainian г in гопак.',
  },
  {
    letter: 'м',
    ipa: 'm',
    place: 'bilabial',
    manner: 'nasal',
    voiced: true,
    how: 'Both lips close, air through the nose. As Russian м.',
  },
  {
    letter: 'н',
    ipa: 'n',
    place: 'alveolar',
    manner: 'nasal',
    voiced: true,
    how: 'Tongue tip at the upper front teeth, air through the nose. As Russian н.',
  },
  {
    letter: 'нг',
    ipa: 'ŋ',
    place: 'velar',
    manner: 'nasal',
    voiced: true,
    how: 'Back of the tongue against the palate, air through the nose. Has no letter of its own: it is written н at the end of a word (зон, хуһан) and before х or г (анха, анги).',
  },
  {
    letter: 'л',
    ipa: 'l',
    place: 'alveolar',
    manner: 'lateral',
    voiced: true,
    how: 'Tongue tip up, air passes at the sides. As Russian л.',
  },
  {
    letter: 'р',
    ipa: 'r',
    place: 'alveolar',
    manner: 'trill',
    voiced: true,
    how: 'Tongue tip vibrates. As Russian р.',
  },
  {
    letter: 'й',
    ipa: 'j',
    place: 'palatal',
    manner: 'approximant',
    voiced: true,
    how: 'Middle of the tongue rises towards the palate. As Russian й. Found only inside a word.',
  },
];

// ─── Nominal Cases ─────────────────────────────────────────────────────────

export interface CaseSuffix {
  afterConsonant: string;
  afterVowel?: string;
  frontVariant?: string; // front-harmony variant
  backVariant?: string; // back-harmony variant
}

export interface GrammarCase {
  id: string;
  buryad: string;
  english: string;
  russian: string;
  semanticRole: string;
  questions: string[];
  suffix: CaseSuffix;
  examples: Array<{ stem: string; inflected: string; translation: string; note?: string }>;
  colorClass: string;
  analogy: string; // comparison to English or Russian
  corpusQuery?: string; // word-form pattern for the Buryat National Corpus (* = any letters)
}

export const CASES: GrammarCase[] = [
  {
    id: 'nominative',
    buryad: 'Нэрын падеж',
    english: 'Nominative',
    russian: 'Именительный',
    semanticRole: 'Subject / citation form',
    questions: ['Хэн? (Who?)', 'Юун? (What?)'],
    suffix: { afterConsonant: '—', afterVowel: '—' },
    examples: [
      { stem: 'гэр', inflected: 'гэр', translation: 'house (is)' },
      { stem: 'нохой', inflected: 'нохой', translation: 'dog (is)' },
      { stem: 'эхэ', inflected: 'эхэ', translation: 'mother (is)' },
    ],
    colorClass: 'bg-blue-50 border-blue-200 text-blue-900',
    analogy: 'Like English subject: "The house is big."',
  },
  {
    id: 'genitive',
    corpusQuery: '*ын',
    buryad: 'Хамаанай падеж',
    english: 'Genitive',
    russian: 'Родительный',
    semanticRole: 'Possession / association',
    questions: ['Хэнэй? (Whose?)', 'Юунэй? (Of what?)'],
    suffix: { afterConsonant: '-ай/-эй/-ой', afterVowel: '-н/-ын/-ийн' },
    examples: [
      { stem: 'гэр', inflected: 'гэрэй', translation: 'of the house', note: 'back harmony' },
      { stem: 'эхэ', inflected: 'эхын', translation: "mother's", note: 'front + vowel-final' },
      { stem: 'нохой', inflected: 'нохойн', translation: "dog's", note: 'after й' },
    ],
    colorClass: 'bg-amber-50 border-amber-200 text-amber-900',
    analogy: 'Like English \'s or Russian -а/-я: "house\'s roof"',
  },
  {
    id: 'dative',
    corpusQuery: '*да',
    buryad: 'Зүгэй падеж',
    english: 'Dative-Locative',
    russian: 'Дательно-местный',
    semanticRole: 'Direction / location / recipient',
    questions: ['Хэндэ? (To whom?)', 'Хаана? (Where?)'],
    // Textbook p. 39: -да after л, м, н, ж, з, vowels and consonant clusters; -та after the rest.
    suffix: {
      afterConsonant: '-да after л, м, н, ж, з · -та after other consonants (б, г, д, р, с…)',
      afterVowel: '-да/-дэ/-до',
    },
    examples: [
      { stem: 'гэр', inflected: 'гэртэ', translation: 'in/to the house', note: '-тэ after р' },
      { stem: 'ажал', inflected: 'ажалда', translation: 'at/to work', note: '-да after л, м, н' },
      { stem: 'класс', inflected: 'класста', translation: 'in/to the class', note: '-та after с' },
      { stem: 'Улаан-Үдэ', inflected: 'Улаан-Үдэдэ', translation: 'in Ulan-Ude' },
      { stem: 'аха', inflected: 'ахада', translation: 'to (my) brother' },
    ],
    colorClass: 'bg-green-50 border-green-200 text-green-900',
    analogy: 'Combines Russian dative (-у/-ю) AND locative (в/на + prep.) into one case',
  },
  {
    id: 'accusative',
    corpusQuery: '*ые',
    buryad: 'Үйлын падеж',
    english: 'Accusative',
    russian: 'Винительный',
    semanticRole: 'Direct object (definite)',
    questions: ['Хэниие? (Whom?)', 'Юуе? (What?)'],
    // Textbook pp. 33–34. A "stable" н stays (хүн → хүниие); an "unstable" one drops
    // (модон → модые). Which nouns have which н is lexical.
    suffix: {
      afterConsonant: '-ые · -иие after stable н · -гые after back н (ан → ангые)',
      afterVowel: '-ые (short final vowel drops) · -иие after и · -е after long vowels and й',
    },
    examples: [
      { stem: 'ном', inflected: 'номые', translation: 'the book (obj.)' },
      { stem: 'аха', inflected: 'ахые', translation: 'the brother (obj.)' },
      { stem: 'гэр', inflected: 'гэрые', translation: 'the house (obj.)' },
      { stem: 'хүн', inflected: 'хүниие', translation: 'the person (obj.)', note: '-иие after н' },
      { stem: 'ой', inflected: 'ойе', translation: 'the anniversary (obj.)', note: '-е after й' },
      {
        stem: 'шанаа',
        inflected: 'шанаае',
        translation: 'the cheekbone (obj.)',
        note: '-е after a long vowel',
      },
      {
        stem: 'ан',
        inflected: 'ангые',
        translation: 'the wild animal (obj.)',
        note: '-гые after back н',
      },
    ],
    colorClass: 'bg-purple-50 border-purple-200 text-purple-900',
    analogy:
      'Used for definite objects; indefinite objects take nominative form (differential object marking)',
  },
  {
    id: 'instrumental',
    corpusQuery: '*аар',
    buryad: 'Зэбсэгэй падеж',
    english: 'Instrumental',
    russian: 'Орудный',
    semanticRole: 'Means / instrument / path',
    questions: ['Юугээр? (With/by what?)', 'Яагаад? (How?)'],
    // Textbook p. 36: a short final vowel drops (ахаар), и fuses (һургууляар, морёор), long
    // vowels and diphthongs take г (бороогоор, нохойгоор).
    suffix: {
      afterConsonant: '-аар/-ээр/-оор/-өөр',
      afterVowel:
        '-аар (short vowel drops) · -яар/-еэр/-ёор after и · -гаар/-гээр/-гоор after long vowels and й',
    },
    examples: [
      { stem: 'гар', inflected: 'гараар', translation: 'by hand' },
      { stem: 'галта тэргэ', inflected: 'галта тэргээр', translation: 'by train' },
      { stem: 'зам', inflected: 'замаар', translation: 'along the road' },
    ],
    colorClass: 'bg-orange-50 border-orange-200 text-orange-900',
    analogy: 'Like Russian творительный (писать ручкой) or English "by/with"',
  },
  {
    id: 'comitative',
    corpusQuery: '*тай',
    buryad: 'Хамтын падеж',
    english: 'Comitative',
    russian: 'Совместный',
    semanticRole: 'Accompaniment / having a quality',
    questions: ['Хэнтэй? (With whom?)', 'Юунтэй? (With what?)'],
    suffix: { afterConsonant: '-тай/-тэй/-той', afterVowel: '-тай/-тэй/-той' },
    examples: [
      { stem: 'аха', inflected: 'ахатай', translation: 'with (my) brother' },
      { stem: 'нохой', inflected: 'нохойтой', translation: 'with a dog' },
      { stem: 'мүнгэн', inflected: 'мүнгэтэй', translation: 'with money / having money' },
    ],
    colorClass: 'bg-pink-50 border-pink-200 text-pink-900',
    analogy: 'Like "together with"; also expresses possession: "man with a car" = "car-having man"',
  },
  {
    id: 'ablative',
    corpusQuery: '*һаа',
    buryad: 'Гаралай падеж',
    english: 'Ablative',
    russian: 'Исходный',
    semanticRole: 'Origin / separation / comparison',
    questions: ['Хэнһээ? (From whom?)', 'Хаанаһаа? (From where?)'],
    suffix: { afterConsonant: '-һаа/-һээ/-һоо/-һөө', afterVowel: '-һаа/-һээ/-һоо/-һөө' },
    examples: [
      { stem: 'гэр', inflected: 'гэрһээ', translation: 'from the house' },
      { stem: 'Москва', inflected: 'Москваһаа', translation: 'from Moscow' },
      { stem: 'аха', inflected: 'ахаһаа', translation: 'from (my) brother; than my brother' },
    ],
    colorClass: 'bg-teal-50 border-teal-200 text-teal-900',
    analogy:
      'Like Russian из/от/чем or English "from/than". The suffix-initial һ is a fricative from older *s (cf. Mongolian -аас); Buryat school grammars describe it as pharyngeal.',
  },
];

// ─── Verb System ──────────────────────────────────────────────────────────

export interface VerbForm {
  label: string;
  suffix: string;
  example: { verb: string; form: string; translation: string };
  note: string;
}

export const VERB_STEMS = {
  ябаха: { meaning: 'to go', root: 'яба' },
  уншаха: { meaning: 'to read', root: 'унша' },
  байха: { meaning: 'to be', root: 'бай' },
};

export const VERB_FORMS: VerbForm[] = [
  {
    label: 'Infinitive',
    suffix: '-ха/-хэ/-хо',
    example: { verb: 'ябаха', form: 'ябаха', translation: 'to go' },
    note: 'Citation form; with auxiliary verbs; and, ending a sentence, the future tense: ябахаб "I will go" (see Tenses).',
  },
  {
    label: 'Present',
    suffix: '-на/-нэ/-но',
    example: { verb: 'яба-', form: 'ябана', translation: '(I/he/she) go(es), is going' },
    note: 'Present tense (textbook p. 28). The future is the -ха form: ябахаб "I will go".',
  },
  {
    label: 'Simple Past',
    suffix: '-ба/-бэ/-бо',
    example: { verb: 'яба-', form: 'ябаба', translation: '(I/he/she) went' },
    note: 'Completed action in the past.',
  },
  {
    label: 'Perfect',
    suffix: '-аа/-ээ/-оо/-өө',
    example: { verb: 'яба-', form: 'ябаа', translation: '(he/she) went / has gone' },
    note: 'The most frequent finite past in written Buryad (хүдэлөө, хэлээ). Takes person endings: ябааб, ябаабди.',
  },
  {
    label: 'Past Participle',
    suffix: '-һан/-һэн/-һон',
    example: { verb: 'яба-', form: 'ябаһан', translation: '(who) went; (he/she) went' },
    note: 'Modifies nouns (ябаһан хүн "the person who went") and also ends sentences as a past tense.',
  },
  {
    label: 'Resultative',
    suffix: '-нхай/-нхэй/-нхой',
    example: { verb: 'ерэ-', form: 'ерэнхэй', translation: '(he/she) has come, is here' },
    note: 'The state left by a finished action: һуунхай "has sat down, is sitting". Often becomes an adjective: туранхай "thin, emaciated".',
  },
  {
    label: 'Imperative',
    suffix: '(bare stem) / -г / -гты',
    example: {
      verb: 'яба-',
      form: 'яба! / ябаг! / ябагты',
      translation: 'Go! (3 imperative forms)',
    },
    note: 'Three imperative forms: bare stem (direct 2nd-person), -г (jussive/permissive — "Let him/her do", "Пусть…"), -гты (formal/to elders).',
  },
  {
    label: 'Negative',
    suffix: '-даггүй / -аагүй / -хагүй',
    example: { verb: 'яба-', form: 'ябадаггүй', translation: 'does not go (habitually)' },
    note: 'The negator -гүй follows the habitual (ябадаггүй), the perfect (ябаагүй), the infinitive (ябахагүй "will not go"), the present (ябанагүй "is not going") or the past (ерэбэгүй "did not come"). -дүй on the perfect means "not yet": ябаадүй "hasn\'t gone yet (but will)".',
  },
  {
    label: 'Simultaneous Converb',
    suffix: '-жа/-жэ/-жо',
    example: { verb: 'яба-', form: 'ябажа', translation: 'going (while doing)' },
    note: 'Action simultaneous with main verb. Like English "-ing" participial.',
  },
  {
    label: 'Sequential Converb',
    suffix: '-аад/-ээд/-оод/-өөд',
    example: { verb: 'яба-', form: 'ябаад', translation: 'having gone (then…)' },
    note: 'Prior completed action, then main clause follows.',
  },
  {
    label: 'Conditional',
    suffix: '-бал/-бол/-бэл',
    example: { verb: 'яба-', form: 'ябабал', translation: 'if (one) goes' },
    note: 'Protasis of conditional sentences (if-clause).',
  },
];

// ─── Extended Verb Data ───────────────────────────────────────────────────

export interface VerbParadigm {
  root: string;
  infinitive: string;
  meaning: string;
  harmony: 'back' | 'front';
  forms: {
    presentFuture: string;
    simplePast: string;
    perfect: string; // -аа: the most frequent finite past
    pastParticiple: string; // -һан: relative clauses and narrative past
    habitual: string;
    imperative: string; // bare stem — direct 2nd-person command
    jussive: string; // suffix -г — permissive/optative: "Let him/her…" / "Пусть…"
    politeImperative: string; // suffix -гты — formal 2nd-person, to elders
    infinitive: string;
    negPresentFuture: string;
    negPast: string;
    simultConv: string;
    seqConv: string;
    conditional: string;
    verbalNoun: string;
    participle: string;
  };
}

export const VERB_PARADIGMS: VerbParadigm[] = [
  {
    root: 'яба',
    infinitive: 'ябаха',
    meaning: 'to go',
    harmony: 'back',
    forms: {
      presentFuture: 'ябана',
      simplePast: 'ябаба',
      perfect: 'ябаа',
      pastParticiple: 'ябаһан',
      habitual: 'ябадаг',
      imperative: 'яба!',
      jussive: 'ябаг!',
      politeImperative: 'ябагты',
      infinitive: 'ябаха',
      negPresentFuture: 'ябадаггүй',
      negPast: 'ябаагүй',
      simultConv: 'ябажа',
      seqConv: 'ябаад',
      conditional: 'ябабал',
      verbalNoun: 'ябадал',
      participle: 'ябадаг',
    },
  },
  {
    root: 'унша',
    infinitive: 'уншаха',
    meaning: 'to read',
    harmony: 'back',
    forms: {
      presentFuture: 'уншана',
      simplePast: 'уншаба',
      perfect: 'уншаа',
      pastParticiple: 'уншаһан',
      habitual: 'уншадаг',
      imperative: 'унша!',
      jussive: 'уншаг!',
      politeImperative: 'уншагты',
      infinitive: 'уншаха',
      negPresentFuture: 'уншадаггүй',
      negPast: 'уншаагүй',
      simultConv: 'уншажа',
      seqConv: 'уншаад',
      conditional: 'уншабал',
      verbalNoun: 'уншалга',
      participle: 'уншадаг',
    },
  },
  {
    root: 'бай',
    infinitive: 'байха',
    meaning: 'to be / to exist',
    harmony: 'back',
    forms: {
      presentFuture: 'байна',
      simplePast: 'байба',
      perfect: 'байгаа',
      pastParticiple: 'байһан',
      habitual: 'байдаг',
      imperative: 'бай!',
      jussive: 'байг!',
      politeImperative: 'байгты',
      infinitive: 'байха',
      negPresentFuture: 'байдаггүй',
      negPast: 'байгаагүй',
      simultConv: 'байжа',
      seqConv: 'байгаад',
      conditional: 'байбал',
      verbalNoun: 'байдал',
      participle: 'байдаг',
    },
  },
  {
    // и-stem: short suffixes attach as is (corpus эдихэ, эдидэг, эдижэ); long ones fuse
    // и + ээ → еэ (эдеэ, эдеэд). Same pattern as бари → баряад.
    root: 'эди',
    infinitive: 'эдихэ',
    meaning: 'to eat',
    harmony: 'front',
    forms: {
      presentFuture: 'эдинэ',
      simplePast: 'эдибэ',
      perfect: 'эдеэ',
      pastParticiple: 'эдиһэн',
      habitual: 'эдидэг',
      imperative: 'эди!',
      jussive: 'эдиг!',
      politeImperative: 'эдигты',
      infinitive: 'эдихэ',
      negPresentFuture: 'эдидэггүй',
      negPast: 'эдеэгүй',
      simultConv: 'эдижэ',
      seqConv: 'эдеэд',
      conditional: 'эдибэл',
      verbalNoun: 'эдилгэ',
      participle: 'эдидэг',
    },
  },
];

export interface VerbDerivation {
  label: string;
  suffix: string;
  buryad: string;
  meaning: string;
  english: string;
  color: string;
  description: string;
  example: { base: string; derived: string; baseGloss: string; derivedGloss: string };
  corpusQuery?: string; // word-form pattern for the Buryat National Corpus (* = any letters)
  buryadUnverified?: boolean; // the Buryad term is not attested in any source (question C2)
}

export const VERB_DERIVATIONS: VerbDerivation[] = [
  {
    label: 'Causative',
    suffix: '-уул/-үүл · -лга/-лгэ · -га/-го',
    buryad: 'Үйлдүүлэгшэ',
    buryadUnverified: true,
    meaning: 'Cause someone to do X',
    english: 'make/let someone do',
    color: 'bg-amber-50 border-amber-300 text-amber-900',
    description:
      'The causative suffix adds an argument — the causer: ябаха "go" → ябуулха "send". Most stems take -уул/-үүл; stems ending in a long vowel or й take -лга/-лгэ (һууха → һуулгаха "seat", байха → байлгаха "keep"); и-stems give -юул (эдихэ → эдюулхэ "feed"); some verbs have their own form (гараха → гаргаха "take out", болохо → болгохо "make").',
    example: {
      base: 'ябаха',
      derived: 'ябуулха',
      baseGloss: 'to go',
      derivedGloss: 'to send / make go',
    },
  },
  {
    label: 'Passive',
    corpusQuery: '*гда*',
    suffix: '-гда/-гдэ/-гдо · -да · -та',
    buryad: 'Эдлүүлэгшэ',
    buryadUnverified: true,
    meaning: 'Action done to subject',
    english: 'be done (to)',
    color: 'bg-mongol-50 border-mongol-300 text-mongol-900',
    description:
      'The passive suffix demotes the agent; the patient becomes the subject. Most stems take -гда; a few short stems take -да (оло → олдохо "be found") or -та (аба → абтаха "be taken", үгэ → үгтэхэ "be given").',
    example: {
      base: 'уншаха',
      derived: 'уншагдаха',
      baseGloss: 'to read',
      derivedGloss: 'to be read',
    },
  },
  {
    label: 'Reciprocal',
    suffix: '-лда/-лдэ/-лдо',
    buryad: 'Хэлсэлэй',
    buryadUnverified: true,
    meaning: 'Mutual / each other',
    english: 'do to each other',
    color: 'bg-purple-50 border-purple-300 text-purple-900',
    description:
      'Two parties act on each other or as partners: Дамба Дашатай барилдаба "Damba wrestled with Dasha", хөөрэлдэбэ "(they) had a talk". With -лса it forms one "reciprocal-cooperative" voice (textbook p. 86).',
    example: {
      base: 'бариха',
      derived: 'барилдаха',
      baseGloss: 'to grab, hold',
      derivedGloss: 'to wrestle (grab each other)',
    },
  },
  {
    label: 'Cooperative',
    corpusQuery: '*лсажа',
    suffix: '-лса/-лсэ/-лсо',
    buryad: 'Хамтаршалай',
    buryadUnverified: true,
    meaning: 'Joint action',
    english: 'do together',
    color: 'bg-pink-50 border-pink-300 text-pink-900',
    description:
      'Someone joins another in the same action (not directed at each other): город ошолсобо "went to town with him", таиралсажа үгэбэ "helped (him) saw", оролсохо "take part".',
    example: {
      base: 'орохо',
      derived: 'оролсохо',
      baseGloss: 'to enter',
      derivedGloss: 'to take part (join in)',
    },
  },
];

export interface ConverbEntry {
  label: string;
  suffix: string;
  semantics: string;
  englishParallel: string;
  color: string;
  examples: Array<{ buryad: string; gloss: string; translation: string }>;
  corpusQuery?: string; // word-form pattern for the Buryat National Corpus (* = any letters)
}

export const CONVERBS: ConverbEntry[] = [
  {
    label: 'Simultaneous',
    corpusQuery: '*жа',
    suffix: '-жа / -жэ / -жо',
    semantics: 'Background action running at the same time as the main verb.',
    englishParallel: 'English "-ing" (while doing)',
    color: 'bg-mongol-50 border-mongol-200',
    examples: [
      {
        buryad: 'Тэрэ дуулажа ябана.',
        gloss: 'he sing-SIM go-PRS',
        translation: 'He is going while singing.',
      },
      {
        buryad: 'Би ябажа уншана.',
        gloss: 'I go-SIM read-PRS',
        translation: 'I read while walking.',
      },
    ],
  },
  {
    label: 'Sequential (Anterior)',
    corpusQuery: '*аад',
    suffix: '-аад / -ээд / -оод / -өөд',
    semantics: 'Action fully completed before the main verb begins.',
    englishParallel: 'English "having done / after doing"',
    color: 'bg-amber-50 border-amber-200',
    examples: [
      { buryad: 'Эдеэд ябаба.', gloss: 'eat-SEQ go-PST', translation: 'Having eaten, he left.' },
      {
        buryad: 'Уншаад амарна.',
        gloss: 'read-SEQ rest-PRS',
        translation: 'After reading, (she) rests.',
      },
    ],
  },
  {
    label: 'Conditional',
    corpusQuery: '*бал',
    suffix: '-бал / -бол / -бэл',
    semantics: 'Marks the if-clause; the other clause is the consequence.',
    englishParallel: 'English "if…"',
    color: 'bg-green-50 border-green-200',
    examples: [
      {
        buryad: 'Бороо оробол бидэ гэртэ байха.',
        gloss: 'rain fall-COND we home stay-INF',
        translation: 'If it rains, we will stay home.',
      },
      {
        buryad: 'Ябабал хэлэгты.',
        gloss: 'go-COND say-IMP.POL',
        translation: 'If you go, please tell (me).',
      },
    ],
  },
  {
    label: 'Concessive',
    corpusQuery: '*башье',
    suffix: '-ААшье һаа · -башье',
    semantics:
      'Concedes a premise while asserting the main clause anyway; the particle -шье means "even". The common form is the perfect -аа + -шье + һаа "if": it allows any person and also "even if" readings. -башье is bookish, takes only a 3rd-person subject, and came into the standard from western and northern dialects (Darzhaeva 2019).',
    englishParallel: 'English "even though / even if"',
    color: 'bg-red-50 border-red-200',
    examples: [
      {
        buryad:
          'Энэ ороолон шүдхэрэй эхэнэр шэнги хоолойгоор хашхараашье һаань, таанад бү ерээрэйгты!',
        gloss: 'this ghoul-GEN woman like voice-INS shout-PERF-even if-3 you NEG come-IMP-POL',
        translation:
          'Even if this ghoul shouts in a woman’s voice, do not come! (Darzhaeva 2019, Buryat corpus)',
      },
      {
        buryad: 'Тиигэбэшье…',
        gloss: 'do.so-CONC',
        translation: 'Even so, … (Buryat National Corpus: 350 uses)',
      },
      {
        buryad: 'Яабашье…',
        gloss: 'do.how-CONC',
        translation: 'No matter what, … / anyway (Buryat National Corpus: 207 uses)',
      },
    ],
  },
  {
    label: 'Purposive',
    suffix: '-ха гэжэ / -ха гэһэн',
    semantics: 'Marks intention or purpose.',
    englishParallel: 'English "in order to / intending to"',
    color: 'bg-purple-50 border-purple-200',
    examples: [
      {
        buryad: 'Ном уншаха гэжэ ерэбэ.',
        gloss: 'book read-INF say-CONV come-PST',
        translation: 'He came (intending) to read a book.',
      },
    ],
  },
];

export interface TenseEntry {
  label: string;
  buryad: string;
  suffix: { back: string; front: string };
  // Where the form sits on the Tense System timeline (-3 long ago … 0 now … +2 future):
  //   point     one event (-ба)               span      a stretch of time (-на: now → future)
  //   repeated  recurring events (-даг)       reachesNow: the result or relevance lasts until now
  timeline: {
    kind: 'point' | 'span' | 'repeated';
    from: number;
    to?: number;
    reachesNow?: boolean;
  };
  aspectuality: 'perfective' | 'imperfective' | 'habitual' | 'n/a';
  examples: Array<{ form: string; translation: string }>;
  note: string;
  corpusQuery?: string; // word-form pattern for the Buryat National Corpus (* = any letters)
}

// Past forms per the burunen.ru corpus (docs/verification-questions.md, A1): -аа and -һан
// dominate written Buryad, -ба is much rarer. The earlier "evidential past -лай" is gone: a
// narrative past in -лай exists (BNC: ошолой 13, ерэлэй 11, ябалай 1, mostly Д.-Д. Дугаров)
// but is rare: Skribnik 2003 (p. 114) calls it obsolete, and it continues the Middle Mongol direct
// evidential past (Skribnik & Aikhenvald 2024, p. 1024). Glosses follow Skribnik & Darzhaeva (2020): -ба PST, -аа PC.PRS,
// -һан PC.PST, -нхай PC.RES; the textbook (p. 67) counts -аа, -нхай, -һан as past participles.
// Buryad names and allomorphs: Khabtagaeva & Kempf 2011, pp. 68-69 (-нхай name also ТСБЯ I:127).
// Badmaeva 2011 (pp. 13-14) defines the same forms; where the sources disagree the note says so.
export const TENSE_ENTRIES: TenseEntry[] = [
  {
    label: 'Simple Past',
    corpusQuery: '*ба',
    buryad: 'Богони үнгэрһэн саг',
    suffix: { back: '-ба', front: '-бэ / -бо' },
    timeline: { kind: 'point', from: -1.8 },
    aspectuality: 'perfective',
    examples: [
      { form: 'ябаба', translation: '(he/she/I) went' },
      { form: 'бэлдэбэ', translation: '(he/she) prepared' },
    ],
    note: 'The plain past tense: a completed event in the past, the simple past in Skribnik (2003, p. 118). It says nothing about how the speaker knows: it continues the neutral past of Middle Mongol (Skribnik & Aikhenvald 2024, p. 1024). Badmaeva (2011, p. 14) also calls it the most neutral past, and notes it can report what has just happened (суглаан эхилэбэ "the meeting has started"). Khabtagaeva & Kempf (2011, p. 68) call it the eyewitness past, but narrative prose uses it for distant events no narrator saw. Takes person endings (уншабаб "I read", уншабад "they read"). Much rarer than -аа in news text.',
  },
  {
    label: 'Past Participle',
    corpusQuery: '*һан',
    buryad: 'Үнгэрһэн сагай причасти',
    suffix: { back: '-һан', front: '-һэн / -һон' },
    timeline: { kind: 'point', from: -1.5 },
    aspectuality: 'perfective',
    examples: [
      { form: 'ябаһан', translation: '(he/she) went; who went' },
      { form: 'бүтээһэн', translation: '(he/she) created; created (by)' },
    ],
    note: 'The general past participle: a completed fact, distant or recent (Khabtagaeva & Kempf 2011, p. 69; Badmaeva 2011, p. 14), begun and ended in the past (textbook p. 68). Modifies nouns (ябаһан хүн "the person who went") and also closes sentences as a narrative past, often with the particle юм and with person endings (һураһанби "I studied"). Its negative is normally -аагүй (Skribnik 2003, p. 115): ерээгүй, rarely ерэһэнгүй.',
  },
  {
    label: 'Perfect',
    corpusQuery: '*аа',
    buryad: 'Үнгэрһэн саг',
    suffix: { back: '-аа', front: '-ээ / -оо / -өө' },
    timeline: { kind: 'point', from: -0.9, reachesNow: true },
    aspectuality: 'perfective',
    examples: [
      { form: 'ябаа', translation: '(he/she) went / has gone' },
      { form: 'хүдэлөө', translation: '(he/she) worked' },
    ],
    note: 'Grammatically a participle used as a finite past: a past event relevant now, the "actual past" in Skribnik (2003, p. 118). The sources differ: Khabtagaeva & Kempf (2011, p. 69) give two uses, an action that began in the past and continues now and an event in the distant past (Шандор Петёфи олон шүлэг зохёогоо "Sándor Petőfi wrote many poems"), while Badmaeva (2011, p. 14) calls it a long-ago past with practically no link to the present. That is not a general rule: Skribnik & Aikhenvald (2024, p. 1025) cite it for last night\'s news, and for the same six verbs in the Buryat National Corpus, үсэгэлдэр "yesterday" occurs with -аа in 41 sentences and with -ба in 10. The most frequent past in the news corpus. Takes person endings (ябааб "I went", ябаабди "we went") and negates as ябаагүй, also the usual negative of the other past forms (p. 70; BNC: ерээгүй 178, ерэбэгүй 44).',
  },
  {
    label: 'Resultative',
    corpusQuery: '*нхай',
    buryad: 'Үни үнгэрһэн сагай причасти',
    suffix: { back: '-нхай', front: '-нхэй / -нхой' },
    timeline: { kind: 'point', from: -0.5, reachesNow: true },
    aspectuality: 'perfective',
    examples: [
      { form: 'ерэнхэй', translation: '(he/she) has come and is here' },
      { form: 'һуунхай', translation: '(he/she) has sat down, is sitting' },
      { form: 'баринхай', translation: 'holding (having taken hold)' },
    ],
    note: 'A state perfect: the action is over and its result is in place now, like "has sat down" = "is sitting". Badmaeva (2011, p. 14) describes it the same way: closely tied to the present, with a result that matters now. Its traditional name means "long-ago past participle" (textbook p. 67: ерэнхэй "давно пришел"; Khabtagaeva & Kempf 2011, p. 69), but the examples are current states (багша эндэ үгы байна, гэртээ ябанхай "the teacher is not here, has gone home"), the explanatory dictionary has мүнөөнэй ерэнхэйб "I have only just arrived" (ТСБЯ II:343), and in the Buryat National Corpus it occurs with мүнөө "now" (101 sentences) and һаяхан "just recently" (15) far more than with эртэ "long ago" (9). It also modifies nouns (ерэнхэй нүхэр "a friend who has arrived"). With a past auxiliary the state is in the past: эсэгэнь үнинэй аяланхай һэн "his father had long since gone away". -нхай байба often adds surprise: "as it turned out, they had already left" (Skribnik & Aikhenvald 2024, p. 1026).',
  },
  {
    label: 'Present Continuous',
    corpusQuery: '*жа',
    buryad: '—',
    suffix: { back: '-жа байна', front: '-жэ байна / -жо байна' },
    timeline: { kind: 'point', from: 0 },
    aspectuality: 'imperfective',
    examples: [
      { form: 'уншажа байна', translation: '(he/she) is reading right now' },
      { form: 'хүдэлжэ байна', translation: '(he/she) is working right now' },
    ],
    note: 'Not a suffix but a phrase: the simultaneous converb -жа/-жэ/-жо plus байна "is". It is how Buryad says "right now, in progress": Дамба номоо уншажа байна "Damba is reading his book" (textbook p. 88). Plain -на also covers "is going"; -жа байна makes "in progress" explicit. With a past auxiliary it is a past progressive: уншажа байба "was reading".',
  },
  {
    label: 'Habitual',
    corpusQuery: '*даг',
    buryad: 'Заншалай хэлбэри',
    suffix: { back: '-даг', front: '-дэг / -дог' },
    timeline: { kind: 'repeated', from: -2.2, to: 1.6 },
    aspectuality: 'habitual',
    examples: [
      { form: 'ябадаг', translation: '(he/she) habitually goes / used to go' },
      { form: 'уншадаг', translation: '(he/she) habitually reads' },
    ],
    note: 'Recurring or characteristic action: ерэдэг "comes each time". Grammatically a timeless participle (textbook p. 60); negated as ябадаггүй. The progressive is a separate construction: -жа байна (хүдэлжэ байна "is working"). With a past auxiliary it is a past habitual: ерэдэг байгаа "used to come" (Badmaeva 2011, p. 16).',
  },
  {
    label: 'Present',
    corpusQuery: '*на',
    buryad: 'Одоо сагай хэлбэри',
    suffix: { back: '-на', front: '-нэ / -но' },
    timeline: { kind: 'span', from: -0.5, to: 0.5 },
    aspectuality: 'imperfective',
    examples: [
      { form: 'ябана', translation: '(he/she) goes, is going' },
      { form: 'уншанаб', translation: 'I read, I am reading' },
    ],
    note: 'The present: морин ябана "the horse is going", бэшэнэб "I write" (textbook p. 28). In the Buryat National Corpus, actions after үглөөдэр "tomorrow" or хожом "later" take -ха (Үглөөдэр … гарахаб "Tomorrow I’ll go"); -на there is the speaker’s present state (һананаб "I think", найданаб "I hope"). To stress "in progress" Buryad adds байна: ябажа байна. Badmaeva (2011, pp. 13–14) adds two uses: telling a past scene in narrative prose and, rarely, a firm near-future plan (номышни ерэхэ неделидэ үгэнэ "I’ll give your book back next week").',
  },
  {
    label: 'Future',
    corpusQuery: '*хаб',
    buryad: '—',
    suffix: { back: '-ха', front: '-хэ / -хо' },
    timeline: { kind: 'span', from: 0.5, to: 2.4 },
    aspectuality: 'n/a',
    examples: [
      { form: 'ябахаб', translation: 'I will go' },
      { form: 'ошохобди', translation: 'we will go' },
      { form: 'мартахагүйб', translation: "I won't forget" },
    ],
    note: 'The infinitive form ending a sentence is a future tense: Харин би ябахаб "But I will go" (textbook p. 40). It takes person endings (Buryat National Corpus: ябахаб 114, ошохобди 86, ябахаш 63; no 3pl -д) and negates as -хагүй: ошохогүйб "I won\'t go". Unlike -на it points only ahead. Grammars also call it the future participle (Skribnik & Darzhaeva 2020: PC.FUT).',
  },
];

// ─── Person & Possession ──────────────────────────────────────────────────
// Unlike Khalkha Mongolian, Buryad marks the subject's person on the predicate and
// the possessor's person on the noun. Every form in `attested` occurs in the
// burunen.ru corpus (docs/verification-questions.md, A3/A4); the endings and the -ба
// paradigm follow the textbook (pp. 28, 37).

export interface PersonEnding {
  person: string;
  pronoun: string;
  suffix: string;
  present: string; // ябана + ending
  past: string; // ябаба + ending
  perfect?: string; // ябаа + ending; 3pl ябаа-д would merge with the converb ябаад
  // ябаха + ending. Buryat National Corpus: ябахаб 114, ябахаш 63, ябахабди 60, ябахат 14;
  // no 3pl -д (ябахад, ерэхэд, ошоход: 0).
  future?: string;
  attested: string[];
}

export const PERSON_ENDINGS: PersonEnding[] = [
  {
    person: '1sg',
    pronoun: 'би',
    suffix: '-б',
    present: 'ябанаб',
    future: 'ябахаб',
    past: 'ябабаб',
    perfect: 'ябааб',
    attested: ['байнаб', 'хүргэнэб', 'байгааб', 'ябааб', 'абтабаб'],
  },
  {
    person: '2sg',
    pronoun: 'ши',
    suffix: '-ш',
    present: 'ябанаш',
    future: 'ябахаш',
    past: 'ябабаш',
    perfect: 'ябааш',
    attested: ['ойлгонош'],
  },
  {
    person: '3sg',
    pronoun: 'тэрэ',
    suffix: '∅',
    present: 'ябана',
    future: 'ябаха',
    past: 'ябаба',
    perfect: 'ябаа',
    attested: ['ябана', 'ябаа'],
  },
  {
    person: '1pl',
    pronoun: 'бидэ',
    suffix: '-бди',
    present: 'ябанабди',
    future: 'ябахабди',
    past: 'ябабабди',
    perfect: 'ябаабди',
    attested: ['байнабди', 'мэдэнэбди', 'ябаабди', 'хэлэдэгбди', 'ябаагүйбди'],
  },
  {
    person: '2pl / polite',
    pronoun: 'та',
    suffix: '-т',
    present: 'ябанат',
    future: 'ябахат',
    past: 'ябабат',
    perfect: 'ябаат',
    attested: ['мэдэнэт', 'байгаат'],
  },
  {
    person: '3pl',
    pronoun: 'тэдэ',
    suffix: '-д',
    present: 'ябанад',
    past: 'ябабад',
    attested: ['ябанад', 'хүдэлнэд', 'тэмдэглэнэд'],
  },
];

export interface PossessiveSuffix {
  person: string;
  suffix: string;
  example: string;
  gloss: string;
  translation: string;
}

export const POSSESSIVE_SUFFIXES: PossessiveSuffix[] = [
  {
    person: '1sg',
    suffix: '-мни',
    example: 'ахамни',
    gloss: 'brother-1SG',
    translation: 'my elder brother',
  },
  {
    person: '2sg',
    suffix: '-шни',
    example: 'багшашни',
    gloss: 'teacher-2SG',
    translation: 'your teacher',
  },
  {
    person: '3',
    suffix: '-нь / -ынь',
    example: 'ажалдань',
    gloss: 'work-DAT-3',
    translation: 'to his/her/their work',
  },
  {
    person: '1pl',
    suffix: '-мнай',
    example: 'багшамнай',
    gloss: 'teacher-1PL',
    translation: 'our teacher',
  },
  {
    person: '2pl',
    suffix: '-тнай',
    example: 'сэдьхэлтнай',
    gloss: 'soul-2PL',
    translation: 'your (pl.) soul',
  },
  {
    person: 'reflexive',
    suffix: '-аа/-ээ/-оо/-өө',
    example: 'нютагтаа',
    gloss: 'homeland-DAT-REFL',
    translation: "in one's own homeland",
  },
];

export interface WordOrderExample {
  buryad: string[];
  gloss: string[];
  translation: string;
  highlight: number; // index of the verb (always last)
}

export const WORD_ORDER_EXAMPLES: WordOrderExample[] = [
  {
    buryad: ['Би', 'ном', 'уншана'],
    gloss: ['I', 'book', 'read-PRS'],
    translation: 'I read a book.',
    highlight: 2,
  },
  {
    buryad: ['Баабай', 'хоол', 'бэлдэнэ'],
    gloss: ['Father', 'food', 'prepare-PRS'],
    translation: 'Father is preparing food.',
    highlight: 2,
  },
  {
    buryad: ['Нагаса эгэшэ', 'Буряадаар', 'хөөрэнэ'],
    gloss: ['Aunt', 'Buryad-INSTR', 'speak-PRS'],
    translation: 'Aunt speaks in Buryat.',
    highlight: 2,
  },
  {
    buryad: ['Хүбүүн', 'сэсэг', 'эхэдэнь', 'үгэбэ'],
    gloss: ['Boy-NOM', 'flower-ACC', 'mother-DAT', 'give-PST'],
    translation: 'The boy gave a flower to his mother.',
    highlight: 3,
  },
];

// ─── Question structures ──────────────────────────────────────────────────

export interface QuestionWord {
  buryad: string;
  gloss: string;
  role?: 'question' | 'marker';
}

export interface QuestionExample {
  structure: string;
  note: string;
  words: QuestionWord[];
  translation: string;
  page: number; // printed page in Сампилова & Бальжинимаева 2003
}

// Sentences from Сампилова & Бальжинимаева 2003; glosses and translations are ours.
// BNC: -өөбта 13, -өөбтэ 0, so the 2pl question ending does not harmonise.
export const QUESTION_EXAMPLES: QuestionExample[] = [
  {
    structure: 'Yes/no question with гү',
    note: 'The book’s answer repeats the sentence without гү: Манайхин центрһээ холо байдаг.',
    words: [
      { buryad: 'Танайхин', gloss: 'you.PL.GEN-family' },
      { buryad: 'центрһээ', gloss: 'centre-ABL' },
      { buryad: 'холо', gloss: 'far' },
      { buryad: 'байдаг', gloss: 'be-HAB' },
      { buryad: 'гү', gloss: 'Q', role: 'marker' },
    ],
    translation: 'Does your family live far from the centre?',
    page: 49,
  },
  {
    structure: 'Yes/no question, person ending on the particle',
    note: 'A second-person subject puts its ending on the particle: гү + -т.',
    words: [
      { buryad: 'Зунай', gloss: 'summer-GEN' },
      { buryad: 'һайхан', gloss: 'fine' },
      { buryad: 'үдэр', gloss: 'day' },
      { buryad: 'хүдөө', gloss: 'countryside' },
      { buryad: 'талада', gloss: 'steppe-DAT' },
      { buryad: 'ябажа', gloss: 'go-CVB' },
      { buryad: 'үзөө', gloss: 'try-PC.PRS' },
      { buryad: 'һэн', gloss: 'be.PST' },
      { buryad: 'гүт', gloss: 'Q-2PL', role: 'marker' },
    ],
    translation: 'Have you ever been out in the countryside on a fine summer day?',
    page: 3,
  },
  {
    structure: 'Question word with separate бэ',
    note: 'ямар stands directly before its noun, and бэ follows the verb as its own word.',
    words: [
      { buryad: 'Танай', gloss: 'you.PL.GEN' },
      { buryad: 'ошоһон', gloss: 'go-PC.PST' },
      { buryad: 'нютагта', gloss: 'place-DAT' },
      { buryad: 'ямар', gloss: 'what.kind', role: 'question' },
      { buryad: 'сэсэгүүд', gloss: 'flower-PL' },
      { buryad: 'ургадаг', gloss: 'grow-HAB' },
      { buryad: 'бэ', gloss: 'Q', role: 'marker' },
    ],
    translation: 'What flowers grow in the place you went to?',
    page: 3,
  },
  {
    structure: 'No verb: noun predicate with бэ',
    note: 'With no verb in the sentence, бэ closes the noun predicate.',
    words: [
      { buryad: '«Гал дүлэн үнгэтэй»', gloss: 'fire.flame colour-COM' },
      { buryad: 'гээшэнь', gloss: 'say-NMLZ-POSS.3' },
      { buryad: 'ямар', gloss: 'what.kind', role: 'question' },
      { buryad: 'модон', gloss: 'tree' },
      { buryad: 'бэ', gloss: 'Q', role: 'marker' },
    ],
    translation: 'Which tree is the “fire-coloured” one?',
    page: 12,
  },
  {
    structure: 'Question word with -б on the verb',
    note: 'The subject is third person, so this -б marks the question, not first person.',
    words: [
      { buryad: 'Үхибүүд', gloss: 'child.PL' },
      { buryad: 'юу', gloss: 'what', role: 'question' },
      { buryad: 'хэнэб', gloss: 'do-PRS-Q', role: 'marker' },
    ],
    translation: 'What are the children doing?',
    page: 6,
  },
  {
    structure: 'Question word with a person ending on the verb',
    note: 'хаана stays directly before the verb, which ends in -б + 2pl -та.',
    words: [
      { buryad: 'Таанар', gloss: 'you.PL' },
      { buryad: 'зунайнгаа', gloss: 'summer-GEN-REFL' },
      { buryad: 'амаралта', gloss: 'holiday' },
      { buryad: 'хаана', gloss: 'where', role: 'question' },
      { buryad: 'үнгэргөөбта', gloss: 'spend-PC.PRS-Q-2PL', role: 'marker' },
    ],
    translation: 'Where did you spend your summer holiday?',
    page: 3,
  },
  {
    structure: 'Question word in a case',
    note: 'хэн takes the case of the word that answers it: хэнһээ → ахайһаа in the book’s reply.',
    words: [
      { buryad: 'Хэнһээ', gloss: 'who-ABL', role: 'question' },
      { buryad: 'бэшэг', gloss: 'letter' },
      { buryad: 'абаабши', gloss: 'get-PC.PRS-Q-2SG', role: 'marker' },
    ],
    translation: 'Who did you get a letter from?',
    page: 49,
  },
  {
    structure: '“Why” with юундэ',
    note: 'юундэ is the dative of юун “what”.',
    words: [
      { buryad: 'Нүхэнэйнгөө', gloss: 'den-GEN-REFL' },
      { buryad: 'амһарта', gloss: 'entrance-DAT' },
      { buryad: 'юундэ', gloss: 'what-DAT', role: 'question' },
      { buryad: 'мүшэр', gloss: 'branch' },
      { buryad: 'обоолооб', gloss: 'pile.up-PC.PRS-Q', role: 'marker' },
    ],
    translation: 'Why did it pile up branches at the entrance to its den?',
    page: 17,
  },
];

// ─── Postpositions ────────────────────────────────────────────────────────

export interface Postposition {
  buryad: string;
  meaning: string;
  caseRequired: string;
  example: { phrase: string; translation: string };
}

export const POSTPOSITIONS: Postposition[] = [
  {
    buryad: 'тухай',
    meaning: 'about / concerning',
    caseRequired: 'Genitive',
    example: { phrase: 'Буряадай тухай', translation: 'about Buryatia' },
  },
  {
    buryad: 'болон',
    meaning: 'and / together with',
    caseRequired: 'Nominative',
    example: { phrase: 'Аха болон дүү', translation: 'elder and younger brother' },
  },
  {
    buryad: 'шэнги',
    meaning: 'like / as',
    caseRequired: 'Nominative',
    example: { phrase: 'шулуун шэнги', translation: 'like a stone' },
  },
  {
    buryad: 'хажуугаар',
    meaning: 'beside / past',
    caseRequired: 'Genitive',
    example: { phrase: 'гэрэй хажуугаар', translation: 'beside the house' },
  },
  {
    buryad: 'дотор',
    meaning: 'inside / within',
    caseRequired: 'Genitive',
    example: { phrase: 'хотын дотор', translation: 'inside the city' },
  },
  {
    buryad: 'гадна',
    meaning: 'outside / except',
    caseRequired: 'Genitive',
    example: { phrase: 'гэрэй гадна', translation: 'outside the house' },
  },
  {
    buryad: 'дээрэ',
    meaning: 'on top of / above',
    caseRequired: 'Genitive',
    example: { phrase: 'шэрээгэй дээрэ', translation: 'on the table' },
  },
  {
    buryad: 'доро',
    meaning: 'below / under',
    caseRequired: 'Genitive',
    example: { phrase: 'шэрээгэй доро', translation: 'under the table' },
  },
];

// ─── Comparison with Related Languages ────────────────────────────────────

export interface LangComparison {
  feature: string;
  buryad: string;
  mongolian: string;
  turkish: string;
  english: string;
}

export const COMPARISONS: LangComparison[] = [
  { feature: 'Word order', buryad: 'SOV', mongolian: 'SOV', turkish: 'SOV', english: 'SVO' },
  {
    feature: 'Case system',
    buryad: '7 cases',
    mongolian: '8 cases',
    turkish: '6 cases',
    english: 'none (word order)',
  },
  {
    feature: 'Vowel harmony',
    buryad: 'Yes (back/front)',
    mongolian: 'Yes',
    turkish: 'Yes',
    english: 'No',
  },
  { feature: 'Grammatical gender', buryad: 'No', mongolian: 'No', turkish: 'No', english: 'No' },
  {
    feature: 'Verb agreement',
    buryad: 'Person/number (predicative suffixes: ябанаб, ябанаш)',
    mongolian: 'None',
    turkish: 'Person/number',
    english: 'Person/number',
  },
  {
    feature: 'Pre/Postpositions',
    buryad: 'Postpositions',
    mongolian: 'Postpositions',
    turkish: 'Postpositions',
    english: 'Prepositions',
  },
  {
    feature: 'Rel. clause position',
    buryad: 'Pre-nominal',
    mongolian: 'Pre-nominal',
    turkish: 'Pre-nominal',
    english: 'Post-nominal',
  },
  {
    feature: 'Evidentiality',
    buryad: 'Via constructions',
    mongolian: 'Yes',
    turkish: 'Yes',
    english: 'Lexical only',
  },
];

// ─── Agglutination Examples ───────────────────────────────────────────────

export interface AgglutinationChain {
  gloss: string;
  steps: Array<{ form: string; added: string; meaning: string }>;
  final: string;
  translation: string;
}

export const AGGLUTINATION_EXAMPLES: AgglutinationChain[] = [
  {
    gloss: 'house → from the houses',
    steps: [
      { form: 'гэр', added: '∅', meaning: 'house (root)' },
      { form: 'гэр-нүүд', added: '-нүүд', meaning: 'houses (plural)' },
      { form: 'гэрнүүдһээ', added: '-һээ', meaning: 'from the houses (ablative)' },
    ],
    final: 'гэрнүүдһээ',
    translation: 'from the houses',
  },
  {
    gloss: 'grab → we wrestle',
    steps: [
      { form: 'бари-', added: '∅', meaning: 'grab, hold (root)' },
      { form: 'барилда-', added: '-лда', meaning: 'grab each other = wrestle (reciprocal)' },
      { form: 'барилдана', added: '-на', meaning: 'wrestles / will wrestle (present-future)' },
      { form: 'барилданабди', added: '-бди', meaning: 'we wrestle (1st person plural)' },
    ],
    final: 'барилданабди',
    translation: 'we wrestle',
  },
];

// ─── Modal words ──────────────────────────────────────────────────────────
// Evidence: docs/verification-questions.md → "Modal words". Dambueva 2020 (pp. 646–647) lists
// хэрэгтэй, ёһотой, аргатай and their kin as one class of modal words.
// Sentences are from the textbook, K&K 2011 or ТСБЯ, cited by printed page, or constructed.

export interface ModalText {
  english: string;
  russian: string;
}

export interface ModalExample {
  buryad: string;
  translation: ModalText;
  source: string;
}

export interface ModalEntry {
  id: string;
  word: string;
  pattern: string;
  meaning: ModalText;
  subject: ModalText;
  example: ModalExample;
  negatives: Array<ModalExample & { pattern: string; meaning: ModalText }>;
  past?: ModalExample;
  note: ModalText;
  corpusQuery: string;
}

export const MODAL_ENTRIES: ModalEntry[] = [
  {
    id: 'hereg',
    word: 'хэрэгтэй',
    pattern: '-ха + хэрэгтэй',
    meaning: {
      english: 'need to, should: a general need or advice',
      russian: 'нужно, надо: общая необходимость или совет',
    },
    subject: {
      english: 'The person who needs to act is often in the dative (намда) or left out.',
      russian: 'Тот, кому нужно действовать, часто стоит в дательном падеже (намда) или опущен.',
    },
    example: {
      buryad: 'Намда суглаанда орохо хэрэгтэй гү?',
      translation: {
        english: 'Do I need to go in to the meeting?',
        russian: 'Нужно ли мне идти на собрание?',
      },
      source: 'K&K p. 215',
    },
    negatives: [
      {
        pattern: '-ха хэрэггүй',
        buryad: 'Намайе хүлеэхэ хэрэггүй, би сагтаа ерэхэб.',
        translation: {
          english: 'No need to wait for me, I will come on time.',
          russian: 'Не нужно меня ждать, я приду вовремя.',
        },
        meaning: { english: 'no need to; do not', russian: 'не нужно; не надо' },
        source: 'K&K p. 103',
      },
      {
        pattern: '-һанай хэрэггүй',
        buryad: 'Мүнөө ошоһонойшни хэрэггүй бшуу.',
        translation: {
          english: 'There is no use your going now.',
          russian: 'Теперь тебе незачем идти.',
        },
        meaning: { english: 'no point in doing', russian: 'незачем, нет смысла' },
        source: 'Textbook p. 69',
      },
    ],
    past: {
      buryad: 'Намда ном уншаха хэрэгтэй байгаа.',
      translation: { english: 'I needed to read a book.', russian: 'Мне нужно было читать книгу.' },
      source: 'constructed; BNC has -ха хэрэгтэй байгаа',
    },
    note: {
      english:
        'A nominative subject also occurs in fiction, with the person ending on һэн: би … -ха хэрэгтэй һэм. хэрэгтэй also works with a noun: Америкэдэ ошохын тулада заабол виза хэрэгтэй "to go to America you definitely need a visa" (K&K p. 203).',
      russian:
        'В художественных текстах встречается и подлежащее в именительном падеже, с личным окончанием на һэн: би … -ха хэрэгтэй һэм. Хэрэгтэй сочетается и с именем: Америкэдэ ошохын тулада заабол виза хэрэгтэй «чтобы поехать в Америку, обязательно нужна виза» (K&K, с. 203).',
    },
    corpusQuery: 'хэрэгтэй*',
  },
  {
    id: 'yoho',
    word: 'ёһотой',
    pattern: '-ха + ёһотой',
    meaning: {
      english: 'must, is obliged to: a duty, stronger than хэрэгтэй',
      russian: 'должен, обязан: долг, сильнее, чем хэрэгтэй',
    },
    subject: {
      english:
        'The subject is in the nominative and the person ending goes on ёһотой: ёһотойб, ёһотойш, ёһотойбди.',
      russian:
        'Подлежащее стоит в именительном падеже, личное окончание принимает ёһотой: ёһотойб, ёһотойш, ёһотойбди.',
    },
    example: {
      buryad: 'Хүн бүри бага наһатайһаа эхилжэ, спорт эрхилхэ ёһотой.',
      translation: {
        english: 'Everyone should take up sport from a young age.',
        russian: 'Каждый должен заниматься спортом с юных лет.',
      },
      source: 'K&K p. 132',
    },
    negatives: [
      {
        pattern: '-ха ёһогүй',
        buryad: 'Инаг дурамнай иигээд лэ унтарха ёһогүй.',
        translation: {
          english: 'Our love must not go out like this.',
          russian: 'Наша любовь не должна так угаснуть.',
        },
        meaning: { english: 'must not', russian: 'не должен' },
        source: 'М. Осодоев, in ТСБЯ 2:37',
      },
      {
        pattern: '-хагүй ёһотой',
        buryad: 'Тэрэ ерэхэгүй ёһотой.',
        translation: {
          english: 'That person is surely not coming. / That person must not come.',
          russian: 'Он наверняка не придёт. / Он не должен приходить.',
        },
        meaning: { english: 'surely will not; must not', russian: 'наверняка не; не должен' },
        source: 'constructed; BNC has -хагүй ёһотой',
      },
    ],
    past: {
      buryad: 'Тэрээндэ һургаха ёһотой байгаа һэн.',
      translation: {
        english: 'People had to be trained in it.',
        russian: 'Этому должны были обучать.',
      },
      source: 'Textbook p. 83',
    },
    note: {
      english:
        'After a participle or -жа байгаа it means "must be, apparently": Багша хүлеэжэ байгаа ёһотой "the teacher must be waiting" (constructed; ТСБЯ 2:41 sense 2).',
      russian:
        'После причастия или -жа байгаа значит «должно быть, видимо»: Багша хүлеэжэ байгаа ёһотой «учитель, должно быть, ждёт» (пример составлен; ТСБЯ 2:41, значение 2).',
    },
    corpusQuery: 'ёһотой*',
  },
  {
    id: 'arga',
    word: 'аргатай',
    pattern: '-ха + аргатай',
    meaning: {
      english: 'can, has a way to: the means or chance exists',
      russian: 'может, имеет возможность: есть способ или случай',
    },
    subject: {
      english: 'Nominative subject; the person ending goes on аргатай: аргатайб, аргатайбди.',
      russian:
        'Подлежащее в именительном падеже; личное окончание принимает аргатай: аргатайб, аргатайбди.',
    },
    example: {
      buryad: 'Гансал уһанай ашаар элүүр, арюун сэбэр ябаха аргатайбди.',
      translation: {
        english: 'Only thanks to water can we stay healthy and clean.',
        russian: 'Только благодаря воде мы можем оставаться здоровыми и чистыми.',
      },
      source: 'Textbook p. 80',
    },
    negatives: [
      {
        pattern: '-ха аргагүй',
        buryad: 'Гараха аргагүй.',
        translation: { english: 'There is no way to go out.', russian: 'Выйти невозможно.' },
        meaning: { english: 'impossible to', russian: 'невозможно' },
        source: 'Textbook p. 106',
      },
      {
        pattern: '-хын аргагүй',
        buryad: 'Тэсэхын аргагүй.',
        translation: { english: 'It is unbearable.', russian: 'Нестерпимо.' },
        meaning: { english: 'impossible to', russian: 'невозможно' },
        source: 'ТСБЯ 1:137',
      },
    ],
    past: {
      buryad: 'Оймоод ошохо аргагүй байба.',
      translation: {
        english: 'It was impossible to wade across.',
        russian: 'Перейти вброд было невозможно.',
      },
      source: 'Textbook p. 38',
    },
    note: {
      english:
        'The negative is far more common: аргагүй 1,616 vs аргатай 184 in the corpus, though many аргагүй are the adverb "extremely" (see Negation).',
      russian:
        'Отрицание встречается гораздо чаще: в корпусе аргагүй 1616, аргатай 184, хотя часть случаев аргагүй — наречие «чрезвычайно» (см. вкладку «Отрицание»).',
    },
    corpusQuery: 'аргагүй',
  },
  {
    id: 'boloho',
    word: 'болохо',
    pattern: '-жа + болохо',
    meaning: {
      english: 'may, it is allowed; it may happen',
      russian: 'можно, разрешено; может случиться',
    },
    subject: {
      english: 'Usually impersonal: болохо stays in the -ха form with no person ending.',
      russian: 'Обычно безлично: болохо остаётся в форме на -ха без личного окончания.',
    },
    example: {
      buryad: 'Наашаа орожо болохо гү? Тиимэ, болохо.',
      translation: {
        english: 'May I come in here? Yes, you may.',
        russian: 'Сюда можно войти? Да, можно.',
      },
      source: 'K&K p. 201',
    },
    negatives: [
      {
        pattern: '-жа болохогүй',
        buryad: 'Хилээмэ хаяжа болохогүй.',
        translation: {
          english: 'Bread must not be thrown away.',
          russian: 'Хлеб нельзя выбрасывать.',
        },
        meaning: { english: 'not allowed, must not', russian: 'нельзя' },
        source: 'Textbook p. 68',
      },
      {
        pattern: '-жа болохогүй',
        buryad: 'Эндэ шангаар хөөрэлдэжэ болохогүй.',
        translation: {
          english: 'You must not talk loudly here.',
          russian: 'Здесь нельзя громко разговаривать.',
        },
        meaning: { english: 'not allowed, must not', russian: 'нельзя' },
        source: 'K&K p. 201',
      },
    ],
    note: {
      english:
        'It also states a likelihood: бороо орожо болохо "it may rain" (ТСБЯ 1:270). K&K limit the "may" sense to the -ха form, but -жа болоно and -жа болоногүй also occur (ажаглажа болоно, Textbook p. 104). -жа болоо can be a guess about the past: "may have".',
      russian:
        'Выражает и вероятность: бороо орожо болохо «может пойти дождь» (ТСБЯ 1:270). K&K допускают значение «можно» только в форме на -ха, но встречаются и -жа болоно, -жа болоногүй (ажаглажа болоно, учебник, с. 104). -жа болоо бывает предположением о прошлом: «возможно, было».',
    },
    corpusQuery: 'болохогүй',
  },
  {
    id: 'shadaha',
    word: 'шадаха',
    pattern: '-жа + шадаха',
    meaning: {
      english: 'can, is able to: skill or strength',
      russian: 'мочь, уметь: умение или сила',
    },
    subject: {
      english: 'An ordinary verb: шада- takes tense and person endings itself.',
      russian: 'Обычный глагол: шада- сам принимает окончания времени и лица.',
    },
    example: {
      buryad: 'Намда хэншье туһалжа шадаха.',
      translation: { english: 'Anyone can help me.', russian: 'Мне может помочь кто угодно.' },
      source: 'K&K p. 147',
    },
    negatives: [
      {
        pattern: '-жа шадахагүй',
        buryad: 'Ямаршье амитан уһагүйгөөр байжа шадахагүй.',
        translation: {
          english: 'No living creature can live without water.',
          russian: 'Ни одно живое существо не может жить без воды.',
        },
        meaning: { english: 'cannot, will not be able', russian: 'не может, не сможет' },
        source: 'Textbook p. 80',
      },
      {
        pattern: '-жа шадаагүй',
        buryad: 'Энэ сүүмхэ ехэ үнэтэй байһанһаа, абажа шадаагүйб.',
        translation: {
          english: 'This bag was very expensive, so I could not buy it.',
          russian: 'Эта сумка была очень дорогой, поэтому я не смог её купить.',
        },
        meaning: { english: 'could not', russian: 'не смог' },
        source: 'K&K p. 165',
      },
    ],
    note: {
      english:
        'The negative also makes a polite request: Та намда туһалжа шадахагүй гүт? "Could you help me?" (K&K p. 155). Corpus: шадахагүй 692, шадаагүй 244, шадабагүй 180, шаданагүй 82.',
      russian:
        'Отрицание служит и вежливой просьбой: Та намда туһалжа шадахагүй гүт? «Вы не могли бы мне помочь?» (K&K, с. 155). В корпусе: шадахагүй 692, шадаагүй 244, шадабагүй 180, шаданагүй 82.',
    },
    corpusQuery: 'шада*гүй*',
  },
];

// One sentence with both words, K&K's own pair (p. 215).
export const MODAL_PAIR = {
  stem: 'Даарахагүйн тула дулаанаар хубсалха',
  advice: 'хэрэгтэй',
  duty: 'ёһотойбди',
  translation: {
    english: 'To avoid getting cold, one should dress warmly.',
    russian: 'Чтобы не замёрзнуть, нужно одеваться тепло.',
  },
  source: 'K&K p. 215',
};

export interface ModalRelative {
  word: string;
  meaning: ModalText;
  example: ModalExample;
}

export const MODAL_RELATIVES: ModalRelative[] = [
  {
    word: '-ха болоо',
    meaning: {
      english: 'ended up having to; it was decided that',
      russian: 'пришлось; решено, что',
    },
    example: {
      buryad: 'Нюргамни үбдэнэ, тиимэһээ эмшэндэ ябаха болооб.',
      translation: {
        english: 'My back hurts, so I have to go to the doctor.',
        russian: 'У меня болит спина, поэтому мне придётся пойти к врачу.',
      },
      source: 'K&K p. 201; ТСБЯ 1:270',
    },
  },
  {
    word: '-ха һанаатай',
    meaning: { english: 'intends to', russian: 'намерен' },
    example: {
      buryad: 'Би багша болохо һанаатайб.',
      translation: { english: 'I intend to become a teacher.', russian: 'Я хочу стать учителем.' },
      source: 'K&K p. 201',
    },
  },
  {
    word: '-ха дуратай',
    meaning: { english: 'likes to', russian: 'любит' },
    example: {
      buryad: 'Би хоолоо эдингээ, халуун сай ууха дуратайб.',
      translation: {
        english: 'While eating, I like to drink hot tea.',
        russian: 'Во время еды я люблю пить горячий чай.',
      },
      source: 'K&K p. 203',
    },
  },
  {
    word: '-бал зүйтэй',
    meaning: { english: 'it is right to, one ought to', russian: 'следует, надлежит' },
    example: {
      buryad: 'Аба эжыгээ хүндэлбэлтнай зүйтэй байна.',
      translation: {
        english: 'You ought to respect your parents.',
        russian: 'Вам следует уважать родителей.',
      },
      source: 'ТСБЯ 2:193',
    },
  },
];

export type ModalChipRole = 'subject' | 'verb' | 'modal' | 'ending' | 'plain';

export interface ModalFrame {
  family: 'ха' | 'жа';
  words: Array<{ buryad: string; gloss: string; role?: ModalChipRole }>;
  translation: ModalText;
  source: string;
}

// The two families: -ха + a predicate word, -жа + a verb that inflects.
export const MODAL_FRAMES: ModalFrame[] = [
  {
    family: 'ха',
    words: [
      { buryad: 'энэ ном', gloss: 'this book' },
      { buryad: 'намда', gloss: 'I-DAT', role: 'subject' },
      { buryad: 'уншаха', gloss: 'read-INF', role: 'verb' },
      { buryad: 'хэрэгтэй', gloss: 'necessary', role: 'modal' },
    ],
    translation: {
      english: 'I need to read this book.',
      russian: 'Мне нужно прочитать эту книгу.',
    },
    source: 'K&K p. 215, shortened',
  },
  {
    family: 'ха',
    words: [
      { buryad: 'энэ ном', gloss: 'this book' },
      { buryad: 'уншаха', gloss: 'read-INF', role: 'verb' },
      { buryad: 'ёһотой', gloss: 'obliged', role: 'modal' },
      { buryad: '-б', gloss: '1SG', role: 'ending' },
    ],
    translation: {
      english: 'I am obliged to read this book.',
      russian: 'Я обязан прочитать эту книгу.',
    },
    source: 'K&K p. 215, shortened',
  },
  {
    family: 'жа',
    words: [
      { buryad: 'Эндэ', gloss: 'here' },
      { buryad: 'шангаар', gloss: 'loudly' },
      { buryad: 'хөөрэлдэжэ', gloss: 'talk-CVB', role: 'verb' },
      { buryad: 'болохогүй', gloss: 'be.allowed-INF-NEG', role: 'modal' },
    ],
    translation: {
      english: 'You must not talk loudly here.',
      russian: 'Здесь нельзя громко разговаривать.',
    },
    source: 'K&K p. 201',
  },
  {
    family: 'жа',
    words: [
      { buryad: 'абажа', gloss: 'take-CVB', role: 'verb' },
      { buryad: 'шадаагүй', gloss: 'be.able-PERF-NEG', role: 'modal' },
      { buryad: '-б', gloss: '1SG', role: 'ending' },
    ],
    translation: { english: 'I could not buy it.', russian: 'Я не смог купить.' },
    source: 'K&K p. 165, shortened',
  },
];

export type ModalCorner = 'must' | 'mustNot' | 'may' | 'needNot';

export interface ModalCornerEntry {
  id: ModalCorner;
  forms: string[];
  example: ModalExample;
  opposite: ModalCorner;
}

// The square of opposition: each corner is the exact negation of the corner across the diagonal.
export const MODAL_CORNERS: ModalCornerEntry[] = [
  {
    id: 'must',
    forms: ['-ха ёһотой', '-ха хэрэгтэй'],
    opposite: 'needNot',
    example: {
      buryad: 'Спорт эрхилхэ ёһотой.',
      translation: { english: 'One must do sport.', russian: 'Нужно заниматься спортом.' },
      source: 'K&K p. 132, shortened',
    },
  },
  {
    id: 'mustNot',
    forms: ['-жа болохогүй', '-ха ёһогүй', '-хагүй ёһотой'],
    opposite: 'may',
    example: {
      buryad: 'Галдаа уһа адхажа болохогүй.',
      translation: {
        english: 'Water must not be poured on your fire.',
        russian: 'Нельзя лить воду в огонь.',
      },
      source: 'Textbook p. 81',
    },
  },
  {
    id: 'may',
    forms: ['-жа болохо', '-ха аргатай', '-жа шадаха'],
    opposite: 'mustNot',
    example: {
      buryad: 'Сай уужа болохо гү?',
      translation: { english: 'May I have some tea?', russian: 'Можно выпить чаю?' },
      source: 'Textbook p. 103',
    },
  },
  {
    id: 'needNot',
    forms: ['-ха хэрэггүй', '-һанай хэрэггүй'],
    opposite: 'must',
    example: {
      buryad: 'Айха хэрэггүй.',
      translation: { english: 'There is no need to be afraid.', russian: 'Не нужно бояться.' },
      source: 'K&K p. 119',
    },
  },
];

// Where the negation can go. `share` sums up the BNC check in the verification notes.
export interface ModalNegationRow {
  word: string;
  onModal: string;
  onVerb?: string;
  withBeshe?: string;
  share: ModalText;
}

export const MODAL_NEGATION: ModalNegationRow[] = [
  {
    word: '-ха хэрэгтэй',
    onModal: '-ха хэрэггүй, -һанай хэрэггүй',
    onVerb: '-хагүй хэрэгтэй',
    withBeshe: 'хэрэгтэй бэшэ',
    share: {
      english:
        '-һанай хэрэггүй is the more frequent (about 170 sentences vs 70 for -ха хэрэггүй). -хагүй хэрэгтэй is rare. хэрэгтэй бэшэ goes with nouns: in 44 samples, none had a verb in -ха.',
      russian:
        '-һанай хэрэггүй встречается чаще (около 170 предложений против 70 у -ха хэрэггүй). -хагүй хэрэгтэй редко. хэрэгтэй бэшэ употребляется с именами: в 44 примерах ни одного глагола на -ха.',
    },
  },
  {
    word: '-ха ёһотой',
    onModal: '-ха ёһогүй',
    onVerb: '-хагүй ёһотой',
    withBeshe: '-ха ёһотой бэшэ',
    share: {
      english:
        '-ха ёһогүй is the plain "must not" (95 of 100 sampled ёһогүй follow -ха). -хагүй ёһотой often predicts: "surely won\'t". -ха ёһотой бэшэ is mostly rhetorical: 7 of 9 samples mean "shouldn\'t I…?"',
      russian:
        '-ха ёһогүй — обычное «не должен» (95 из 100 примеров ёһогүй стоят после -ха). -хагүй ёһотой часто предсказывает: «наверняка не». -ха ёһотой бэшэ в основном риторично: 7 из 9 примеров значат «разве я не должен…?»',
    },
  },
  {
    word: '-ха аргатай',
    onModal: '-ха аргагүй, -хын аргагүй',
    withBeshe: 'аргатай бэшэ',
    share: {
      english: 'Use аргагүй. аргатай бэшэ is marginal: 1 of the 8 sentences checked.',
      russian: 'Используйте аргагүй. аргатай бэшэ маргинально: 1 из 8 проверенных предложений.',
    },
  },
  {
    word: '-жа болохо',
    onModal: '-жа болохогүй',
    share: {
      english: 'The standard way to forbid something.',
      russian: 'Обычное выражение запрета.',
    },
  },
  {
    word: '-жа шадаха',
    onModal: '-жа шадахагүй, шадаагүй, шадабагүй, шаданагүй',
    share: {
      english: 'The verb negates like any other, in every tense.',
      russian: 'Глагол отрицается как любой другой, во всех временах.',
    },
  },
];

// Double negation, peeled from the inside out. ТСБЯ 1:270 quotes this from Ц. Шагжин.
// BNC: 6 of the 28 sentences with байжа болохогүй have a -нгүй verb before them.
export const MODAL_DOUBLE_NEGATION = {
  buryad: 'Хэлэһэн үгэдөө хүрэнгүй байжа болохогүй.',
  translation: {
    english: 'You cannot fail to keep your word.',
    russian: 'Нельзя не сдержать данное слово.',
  },
  source: 'Ц. Шагжин, in ТСБЯ 1:270',
  layers: [
    {
      buryad: 'хүрэ-',
      meaning: { english: 'keep (one’s word)', russian: 'сдержать (слово)' },
    },
    {
      buryad: 'хүрэнгүй байжа',
      meaning: { english: 'NOT keep it', russian: 'НЕ сдержать' },
    },
    {
      buryad: 'хүрэнгүй байжа болохогүй',
      meaning: {
        english: 'NOT allowed to NOT keep it = you must keep it',
        russian: 'НЕЛЬЗЯ НЕ сдержать = обязательно нужно сдержать',
      },
    },
  ],
};

export interface ModalTrap {
  title: ModalText;
  text: ModalText;
  source: string;
}

export const MODAL_TRAPS: ModalTrap[] = [
  {
    title: {
      english: 'аргагүй + adjective = "extremely"',
      russian: 'аргагүй + прилагательное = «чрезвычайно»',
    },
    text: {
      english:
        'Before an adjective, аргагүй intensifies; it does not mean "impossible": аргагүй сэсэн мэргэн "exceptionally wise". In a sample of 100, 55 followed a verb in -ха or -хын; most others were this adverb.',
      russian:
        'Перед прилагательным аргагүй усиливает значение, а не значит «невозможно»: аргагүй сэсэн мэргэн «исключительно мудрый». Из 100 примеров 55 стояли после глагола на -ха или -хын, большинство остальных — такое наречие.',
    },
    source: 'Textbook p. 97; ТСБЯ 1:137',
  },
  {
    title: {
      english: '-б may be a question, not "I"',
      russian: '-б может быть вопросом, а не «я»',
    },
    text: {
      english:
        'After a question word, -б is the question ending: Энэ бэшэгые хэндэ үгэхэ хэрэгтэйб? "Who should this letter be given to?", Яаха ёһотойб? "What is to be done?". Without one, ёһотойб means "I must".',
      russian:
        'После вопросительного слова -б — вопросительное окончание: Энэ бэшэгые хэндэ үгэхэ хэрэгтэйб? «Кому надо отдать это письмо?», Яаха ёһотойб? «Что делать?». Без него ёһотойб значит «я должен».',
    },
    source: 'K&K pp. 97, 215; Textbook p. 38',
  },
  {
    title: {
      english: 'ёһотой also means "real"',
      russian: 'ёһотой значит и «настоящий»',
    },
    text: {
      english:
        'Before a noun it is an adjective: ёһотой нүхэд "true friends", ёһотой үбэл "real winter". It is modal only after a verb.',
      russian:
        'Перед именем это прилагательное: ёһотой нүхэд «настоящие друзья», ёһотой үбэл «настоящая зима». Модальным оно бывает только после глагола.',
    },
    source: 'ТСБЯ 2:41; K&K p. 215',
  },
];
