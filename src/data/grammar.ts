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
}

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
  },
  {
    letter: 'и',
    long: 'ии',
    ipa: 'i',
    harmony: 'neutral',
    height: 'high',
    backness: 'central',
    rounded: false,
    example: { word: 'ном', meaning: 'book (various)' },
  },
];

export const VOWEL_HARMONY_PAIRS: Array<[string, string]> = [
  ['а', 'э'],
  ['о', 'ө'],
  ['у', 'ү'],
];

export interface Consonant {
  letter: string;
  ipa: string;
  place: string;
  manner: string;
  voiced: boolean;
}

export const CONSONANTS: Consonant[] = [
  { letter: 'б', ipa: 'b', place: 'bilabial', manner: 'plosive', voiced: true },
  { letter: 'п', ipa: 'p', place: 'bilabial', manner: 'plosive', voiced: false },
  { letter: 'д', ipa: 'd', place: 'alveolar', manner: 'plosive', voiced: true },
  { letter: 'т', ipa: 't', place: 'alveolar', manner: 'plosive', voiced: false },
  { letter: 'г', ipa: 'ɡ', place: 'velar', manner: 'plosive', voiced: true },
  { letter: 'к', ipa: 'k', place: 'velar', manner: 'plosive', voiced: false },
  { letter: 'з', ipa: 'z', place: 'alveolar', manner: 'fricative', voiced: true },
  { letter: 'с', ipa: 's', place: 'alveolar', manner: 'fricative', voiced: false },
  { letter: 'ж', ipa: 'dʒ', place: 'postalveolar', manner: 'affricate', voiced: true },
  { letter: 'ш', ipa: 'ʃ', place: 'postalveolar', manner: 'fricative', voiced: false },
  { letter: 'х', ipa: 'x', place: 'velar', manner: 'fricative', voiced: false },
  { letter: 'һ', ipa: 'h', place: 'glottal', manner: 'fricative', voiced: false },
  { letter: 'м', ipa: 'm', place: 'bilabial', manner: 'nasal', voiced: true },
  { letter: 'н', ipa: 'n', place: 'alveolar', manner: 'nasal', voiced: true },
  { letter: 'нг', ipa: 'ŋ', place: 'velar', manner: 'nasal', voiced: true },
  { letter: 'л', ipa: 'l', place: 'alveolar', manner: 'lateral', voiced: true },
  { letter: 'р', ipa: 'r', place: 'alveolar', manner: 'trill', voiced: true },
  { letter: 'й', ipa: 'j', place: 'palatal', manner: 'approximant', voiced: true },
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
// but is rare and nowhere described as evidential. Glosses follow Skribnik & Darzhaeva (2020): -ба PST, -аа PC.PRS,
// -һан PC.PST, -нхай PC.RES; the textbook (p. 67) counts -аа, -нхай, -һан as past participles.
export const TENSE_ENTRIES: TenseEntry[] = [
  {
    label: 'Simple Past',
    corpusQuery: '*ба',
    buryad: 'Үнгэрһэн сагай хэлбэри',
    suffix: { back: '-ба', front: '-бэ' },
    timeline: { kind: 'point', from: -1.8 },
    aspectuality: 'perfective',
    examples: [
      { form: 'ябаба', translation: '(he/she/I) went' },
      { form: 'бэлдэбэ', translation: '(he/she) prepared' },
    ],
    note: 'The plain past tense: a completed event in the past. Takes person endings (уншабаб "I read", уншабад "they read"). Much rarer than -аа in news text.',
  },
  {
    label: 'Past Participle',
    corpusQuery: '*һан',
    buryad: '—',
    suffix: { back: '-һан', front: '-һэн' },
    timeline: { kind: 'point', from: -1.5 },
    aspectuality: 'perfective',
    examples: [
      { form: 'ябаһан', translation: '(he/she) went; who went' },
      { form: 'бүтээһэн', translation: '(he/she) created; created (by)' },
    ],
    note: 'Modifies nouns (ябаһан хүн "the person who went") and also closes sentences as a narrative past.',
  },
  {
    label: 'Perfect',
    corpusQuery: '*аа',
    buryad: '—',
    suffix: { back: '-аа', front: '-ээ / -өө' },
    timeline: { kind: 'point', from: -0.9, reachesNow: true },
    aspectuality: 'perfective',
    examples: [
      { form: 'ябаа', translation: '(he/she) went / has gone' },
      { form: 'хүдэлөө', translation: '(he/she) worked' },
    ],
    note: 'Grammatically a participle used as a finite past: a past event relevant now. The most frequent past in the news corpus. Takes person endings (ябааб "I went", ябаабди "we went") and negates as ябаагүй.',
  },
  {
    label: 'Resultative',
    corpusQuery: '*нхай',
    buryad: '—',
    suffix: { back: '-нхай', front: '-нхэй / -нхой' },
    timeline: { kind: 'point', from: -0.5, reachesNow: true },
    aspectuality: 'perfective',
    examples: [
      { form: 'ерэнхэй', translation: '(he/she) has come and is here' },
      { form: 'һуунхай', translation: '(he/she) has sat down, is sitting' },
      { form: 'баринхай', translation: 'holding (having taken hold)' },
    ],
    note: 'A state perfect: the action is over and its result is in place now, like "has sat down" = "is sitting". The textbook calls it the long-ago past (p. 67: ерэнхэй "давно пришел"), but in the Buryat National Corpus it occurs with мүнөө "now" (101 sentences) and һаяхан "just recently" (15) far more than with эртэ "long ago" (9). With a past auxiliary the state is in the past: эсэгэнь үнинэй аяланхай һэн "his father had long since gone away".',
  },
  {
    label: 'Present Continuous',
    corpusQuery: '*жа',
    buryad: '—',
    suffix: { back: '-жа байна', front: '-жэ байна' },
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
    suffix: { back: '-даг', front: '-дэг' },
    timeline: { kind: 'repeated', from: -2.2, to: 1.6 },
    aspectuality: 'habitual',
    examples: [
      { form: 'ябадаг', translation: '(he/she) habitually goes / used to go' },
      { form: 'уншадаг', translation: '(he/she) habitually reads' },
    ],
    note: 'Recurring or characteristic action; negated as ябадаггүй. The progressive is a separate construction: -жа байна (хүдэлжэ байна "is working").',
  },
  {
    label: 'Present',
    corpusQuery: '*на',
    buryad: 'Одоо сагай хэлбэри',
    suffix: { back: '-на', front: '-нэ' },
    timeline: { kind: 'span', from: -0.5, to: 0.5 },
    aspectuality: 'imperfective',
    examples: [
      { form: 'ябана', translation: '(he/she) goes, is going' },
      { form: 'уншанаб', translation: 'I read, I am reading' },
    ],
    note: 'The present: морин ябана "the horse is going", бэшэнэб "I write" (textbook p. 28). In the Buryat National Corpus, actions after үглөөдэр "tomorrow" or хожом "later" take -ха (Үглөөдэр … гарахаб "Tomorrow I’ll go"); -на there is the speaker’s present state (һананаб "I think", найданаб "I hope"). To stress "in progress" Buryad adds байна: ябажа байна.',
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
    buryad: 'Under review',
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
