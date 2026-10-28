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
}

export const CASES: GrammarCase[] = [
  {
    id: 'nominative',
    buryad: 'Нэрэ падеж',
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
    buryad: 'Харьяалалай падеж',
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
    buryad: 'Зүгэй падеж',
    english: 'Dative-Locative',
    russian: 'Дательно-местный',
    semanticRole: 'Direction / location / recipient',
    questions: ['Хэндэ? (To whom?)', 'Хаана? (Where?)'],
    suffix: {
      afterConsonant: '-да/-дэ/-до · -та/-тэ/-то after д, г, р',
      afterVowel: '-да/-дэ/-до',
    },
    examples: [
      { stem: 'гэр', inflected: 'гэртэ', translation: 'in/to the house', note: '-тэ after р' },
      { stem: 'ажал', inflected: 'ажалда', translation: 'at/to work', note: '-да after л, м, н' },
      { stem: 'Улаан-Үдэ', inflected: 'Улаан-Үдэдэ', translation: 'in Ulan-Ude' },
      { stem: 'аха', inflected: 'ахада', translation: 'to (my) brother' },
    ],
    colorClass: 'bg-green-50 border-green-200 text-green-900',
    analogy: 'Combines Russian dative (-у/-ю) AND locative (в/на + prep.) into one case',
  },
  {
    id: 'accusative',
    buryad: 'Үйлэдэгдэхүүнэй падеж',
    english: 'Accusative',
    russian: 'Винительный',
    semanticRole: 'Direct object (definite)',
    questions: ['Хэниие? (Whom?)', 'Юуниие? (What?)'],
    suffix: {
      afterConsonant: '-ые · -иие after н',
      afterVowel: '-ые (short final vowel drops) · -е after й',
    },
    examples: [
      { stem: 'ном', inflected: 'номые', translation: 'the book (obj.)' },
      { stem: 'аха', inflected: 'ахые', translation: 'the brother (obj.)' },
      { stem: 'гэр', inflected: 'гэрые', translation: 'the house (obj.)' },
      { stem: 'хүн', inflected: 'хүниие', translation: 'the person (obj.)', note: '-иие after н' },
      { stem: 'ой', inflected: 'ойе', translation: 'the anniversary (obj.)', note: '-е after й' },
    ],
    colorClass: 'bg-purple-50 border-purple-200 text-purple-900',
    analogy:
      'Used for definite objects; indefinite objects take nominative form (differential object marking)',
  },
  {
    id: 'instrumental',
    buryad: 'Зэбсэгэй падеж',
    english: 'Instrumental',
    russian: 'Орудный',
    semanticRole: 'Means / instrument / path',
    questions: ['Юугаар? (With/by what?)', 'Яагаад? (How?)'],
    suffix: { afterConsonant: '-аар/-ээр/-оор', afterVowel: '-гаар/-гээр/-гоор' },
    examples: [
      { stem: 'гар', inflected: 'гараар', translation: 'by hand' },
      { stem: 'галта тэрэгэ', inflected: 'галта тэрэгээр', translation: 'by train' },
      { stem: 'зам', inflected: 'замаар', translation: 'along the road' },
    ],
    colorClass: 'bg-orange-50 border-orange-200 text-orange-900',
    analogy: 'Like Russian творительный (писать ручкой) or English "by/with"',
  },
  {
    id: 'comitative',
    buryad: 'Хамтаршалай падеж',
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
    buryad: 'Холдолгын падеж',
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
      'Like Russian из/от/чем or English "from/than". The suffix-initial һ is a glottal fricative from older *s (cf. Mongolian -аас).',
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
    note: 'Citation form. Combines with auxiliary verbs.',
  },
  {
    label: 'Present-Future',
    suffix: '-на/-нэ/-но',
    example: { verb: 'яба-', form: 'ябана', translation: '(I/he/she) go(es) / will go' },
    note: 'Single form for present and future — context disambiguates.',
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
    note: 'The negator -гүй follows the habitual (ябадаггүй), the perfect (ябаагүй) or the infinitive (ябахагүй "will not go").',
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
    root: 'эдеэ',
    infinitive: 'эдеэхэ',
    meaning: 'to eat',
    harmony: 'front',
    forms: {
      presentFuture: 'эдеэнэ',
      simplePast: 'эдеэбэ',
      perfect: 'эдеэ',
      pastParticiple: 'эдеэһэн',
      habitual: 'эдидэг',
      imperative: 'эдеэ!',
      jussive: 'эдеэг!',
      politeImperative: 'эдеэгты',
      infinitive: 'эдеэхэ',
      negPresentFuture: 'эдидэггүй',
      negPast: 'эдеэгүй',
      simultConv: 'эдижэ',
      seqConv: 'эдеэд',
      conditional: 'эдеэбэл',
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
}

export const VERB_DERIVATIONS: VerbDerivation[] = [
  {
    label: 'Causative',
    suffix: '-уул/-үүл / -га/-гэ',
    buryad: 'Үйлдүүлэгшэ',
    meaning: 'Cause someone to do X',
    english: 'make/let someone do',
    color: 'bg-amber-50 border-amber-300 text-amber-900',
    description: 'The causative suffix adds an argument — the causer. From "go" → "make go/send".',
    example: {
      base: 'ябаха',
      derived: 'ябуулха',
      baseGloss: 'to go',
      derivedGloss: 'to send / make go',
    },
  },
  {
    label: 'Passive',
    suffix: '-гда/-гдэ',
    buryad: 'Эдлүүлэгшэ',
    meaning: 'Action done to subject',
    english: 'be done (to)',
    color: 'bg-mongol-50 border-mongol-300 text-mongol-900',
    description: 'The passive suffix demotes the agent; the patient becomes the subject.',
    example: {
      base: 'уншаха',
      derived: 'уншагдаха',
      baseGloss: 'to read',
      derivedGloss: 'to be read',
    },
  },
  {
    label: 'Reflexive',
    suffix: '-да/-дэ',
    buryad: 'Бэеэ үйлдэхэ',
    meaning: 'Action directed at self',
    english: 'do to oneself',
    color: 'bg-green-50 border-green-300 text-green-900',
    description: 'The reflexive marks that the subject acts on itself.',
    example: {
      base: 'угааха',
      derived: 'угаадаха',
      baseGloss: 'to wash (sth)',
      derivedGloss: 'to wash oneself',
    },
  },
  {
    label: 'Reciprocal',
    suffix: '-лда/-лдэ/-лдо',
    buryad: 'Хэлсэлэй',
    meaning: 'Mutual / each other',
    english: 'do to each other',
    color: 'bg-purple-50 border-purple-300 text-purple-900',
    description:
      'The reciprocal marks mutual action between two or more participants, often competitive: барилдаха "wrestle", заргалдаха "sue each other".',
    example: {
      base: 'бариха',
      derived: 'барилдаха',
      baseGloss: 'to grab, hold',
      derivedGloss: 'to wrestle (grab each other)',
    },
  },
  {
    label: 'Cooperative',
    suffix: '-лса/-лсэ/-лсо',
    buryad: 'Хамтаршалай',
    meaning: 'Joint action',
    english: 'do together',
    color: 'bg-pink-50 border-pink-300 text-pink-900',
    description:
      'Several agents take part in the same action jointly (not directed at each other): оролсохо "take part", хабаадалсаха "participate".',
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
}

export const CONVERBS: ConverbEntry[] = [
  {
    label: 'Simultaneous',
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
    suffix: '-башье / -бэшье / -бошье',
    semantics:
      'Concedes a premise while asserting the main clause anyway. Built from the conditional -бал + the particle -шье "even".',
    englishParallel: 'English "even though / even if"',
    color: 'bg-red-50 border-red-200',
    examples: [
      {
        buryad: 'Тиигэбэшье хамтын ажахынууд байгуулагдажа…',
        gloss: 'do.so-CONC collective farm-PL be.founded-CVB.SIM',
        translation: 'Even so, collective farms were founded… (burunen.ru)',
      },
      {
        buryad: 'Оросой ямар нэгэн хото городуудта ажаһуубашье, ажаллабашье һаа…',
        gloss: 'Russia-GEN any town city-PL-DAT live-CONC work-CONC if',
        translation: 'Whatever Russian town they may live or work in… (burunen.ru)',
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
  timelinePosition: number; // -2 past..0 now..+2 future
  aspectuality: 'perfective' | 'imperfective' | 'habitual' | 'n/a';
  examples: Array<{ form: string; translation: string }>;
  note: string;
}

// Past forms per the burunen.ru corpus (docs/verification-questions.md, A1): -аа and -һан
// dominate written Buryad, -ба is much rarer. The earlier "evidential past -лай" is not
// attested; how the three pasts differ in meaning is still to be verified.
export const TENSE_ENTRIES: TenseEntry[] = [
  {
    label: 'Simple Past',
    buryad: 'Үнгэрһэн сагай хэлбэри',
    suffix: { back: '-ба', front: '-бэ' },
    timelinePosition: -2,
    aspectuality: 'perfective',
    examples: [
      { form: 'ябаба', translation: '(he/she/I) went' },
      { form: 'бэлдэбэ', translation: '(he/she) prepared' },
    ],
    note: 'Completed past action. Much rarer than -аа in written Buryad; how the two differ is under review.',
  },
  {
    label: 'Past Participle',
    buryad: '—',
    suffix: { back: '-һан', front: '-һэн' },
    timelinePosition: -2,
    aspectuality: 'perfective',
    examples: [
      { form: 'ябаһан', translation: '(he/she) went; who went' },
      { form: 'бүтээһэн', translation: '(he/she) created; created (by)' },
    ],
    note: 'Modifies nouns (ябаһан хүн "the person who went") and also closes sentences as a narrative past.',
  },
  {
    label: 'Perfect',
    buryad: '—',
    suffix: { back: '-аа', front: '-ээ / -өө' },
    timelinePosition: -1,
    aspectuality: 'perfective',
    examples: [
      { form: 'ябаа', translation: '(he/she) went / has gone' },
      { form: 'хүдэлөө', translation: '(he/she) worked' },
    ],
    note: 'The most frequent finite past in the news corpus. Takes person endings (ябааб "I went", ябаабди "we went") and negates as ябаагүй.',
  },
  {
    label: 'Habitual',
    buryad: 'Заншалай хэлбэри',
    suffix: { back: '-даг', front: '-дэг' },
    timelinePosition: 0,
    aspectuality: 'habitual',
    examples: [
      { form: 'ябадаг', translation: '(he/she) habitually goes / used to go' },
      { form: 'уншадаг', translation: '(he/she) habitually reads' },
    ],
    note: 'Recurring or characteristic action; negated as ябадаггүй. The progressive is a separate construction: -жа байна (хүдэлжэ байна "is working").',
  },
  {
    label: 'Present-Future',
    buryad: 'Одоо / Ерээдүй сагай хэлбэри',
    suffix: { back: '-на', front: '-нэ' },
    timelinePosition: 1,
    aspectuality: 'imperfective',
    examples: [
      { form: 'ябана', translation: '(he/she/I) go(es) / will go' },
      { form: 'уншана', translation: '(he/she/I) read(s) / will read' },
    ],
    note: 'Single form covers present and future. Context disambiguates.',
  },
];

// ─── Person & Possession ──────────────────────────────────────────────────
// Unlike Khalkha Mongolian, Buryad marks the subject's person on the predicate and
// the possessor's person on the noun. Every form in `attested` occurs in the
// burunen.ru corpus (docs/verification-questions.md, A3/A4).

export interface PersonEnding {
  person: string;
  pronoun: string;
  suffix: string;
  present: string; // ябана + ending
  perfect: string; // ябаа + ending
  attested: string[];
}

export const PERSON_ENDINGS: PersonEnding[] = [
  {
    person: '1sg',
    pronoun: 'би',
    suffix: '-б',
    present: 'ябанаб',
    perfect: 'ябааб',
    attested: ['байнаб', 'хүргэнэб', 'байгааб', 'ябааб'],
  },
  {
    person: '2sg',
    pronoun: 'ши',
    suffix: '-ш',
    present: 'ябанаш',
    perfect: 'ябааш',
    attested: ['ойлгонош'],
  },
  {
    person: '3',
    pronoun: 'тэрэ',
    suffix: '∅',
    present: 'ябана',
    perfect: 'ябаа',
    attested: ['ябана', 'ябаа'],
  },
  {
    person: '1pl',
    pronoun: 'бидэ',
    suffix: '-бди',
    present: 'ябанабди',
    perfect: 'ябаабди',
    attested: ['байнабди', 'мэдэнэбди', 'ябаабди', 'хэлэдэгбди', 'ябаагүйбди'],
  },
  {
    person: '2pl / polite',
    pronoun: 'та',
    suffix: '-т',
    present: 'ябанат',
    perfect: 'ябаат',
    attested: ['мэдэнэт', 'байгаат'],
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
