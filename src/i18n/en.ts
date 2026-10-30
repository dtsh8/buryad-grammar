// English interface strings. This file defines the shape every other language must match.
// Buryad words shown as examples (Буряад хэлэн, ябанаб) stay in Buryad in every language.

export const en = {
  siteTitle: 'Буряад Хэлэн — Buryad Grammar',
  brandSubtitle: 'Grammar Reference',
  switcherLabel: 'Interface language',
  loadError: 'Could not load vocabulary:',

  nav: {
    main: 'Main',
    today: 'Today',
    grammar: 'Grammar',
    practice: 'Practice',
    words: 'Words',
  },

  sections: {
    overview: { label: 'Overview', desc: 'Language profile and typology' },
    phonology: { label: 'Phonology', desc: 'Vowel harmony, consonants, long vowels' },
    cases: { label: 'Cases', desc: '7 nominal cases with endings and examples' },
    verbs: { label: 'Verbs', desc: 'Tense, person endings, converbs' },
    wordOrder: { label: 'Word Order', desc: 'SOV, postpositions, modifiers' },
    vocabulary: { label: 'Vocabulary', desc: 'Core words, phrases and numerals' },
    practice: { label: 'Practice', desc: 'Conjugation and case drills' },
  },

  footer: {
    sources: 'Sources',
    corpus: 'Buryat National Corpus',
  },

  home: {
    family: 'Mongolic family',
    hero: 'An interactive grammar reference for the Buryat language — an agglutinative, SOV, vowel-harmonic Mongolic tongue of Eastern Siberia.',
    stats: {
      speakers: 'Native speakers',
      wordOrder: 'Word order',
      cases: 'Nominal cases',
      casesValue: '7 cases',
      harmony: 'Vowel harmony',
      harmonyValue: 'Back / Front',
    },
    profileTitle: 'Language Profile',
    profile: [
      ['Family', 'Mongolic → Central Mongolic'],
      ['Scripts', 'Cyrillic (since 1939), Old Mongolian (historical), Latin (1929–1939)'],
      ['Regions', 'Buryatia, Russia; Mongolia; Inner Mongolia, China'],
      ['Morphology', 'Agglutinative'],
      ['Alignment', 'Nominative–Accusative (with ergative tendencies)'],
    ] as Array<[string, string]>,
    featuresTitle: 'Key Typological Features',
    features: [
      '🧩 Agglutinative morphology — suffixes stack transparently',
      '🔊 Vowel harmony — back vs. front vowels determine suffix shape',
      '🔚 Verb-final (SOV) — verb always last in clause',
      '📐 7 cases — replace prepositions and word-order signals',
      '👤 Person endings — verbs mark the subject (ябанаб "I go"), unlike Khalkha',
      '🚫 No grammatical gender — nouns are genderless',
      '↙️ Pre-nominal modifiers — adjectives and rel. clauses precede nouns',
    ],
    explore: 'Explore the Grammar',
    comparison: 'Cross-Language Comparison',
  },

  comparison: {
    feature: 'Feature',
    langs: { buryad: 'Buryad', mongolian: 'Mongolian', turkish: 'Turkish', english: 'English' },
    insights: [
      {
        title: '🤝 Buryad ≈ Mongolian',
        text: 'Buryad and Mongolian are sister languages — closely related in all structural features. Buryad innovations include the shift s → һ (Mongolian ablative -аас vs Buryad -һаа).',
      },
      {
        title: '🌐 Altaic-type typology',
        text: 'Like Turkish, Buryad is SOV, agglutinative, with vowel harmony and postpositions — features shared across the proposed "Altaic" typological area.',
      },
      {
        title: '↔️ Opposite to English',
        text: 'English learners face mirror-image challenges: verb at the end, modifiers before nouns, cases instead of word order, and no articles.',
      },
    ],
    radarTitle: 'Structural Similarity Radar',
    axes: {
      sov: 'SOV order',
      harmony: 'Vowel harmony',
      cases: 'Cases',
      postpositions: 'Postpositions',
      person: 'Person on verb',
      agglutination: 'Agglutination',
    },
  },

  today: {
    resume: 'Pick up where you left off.',
    start: 'Start with a short drill.',
    continue: 'Continue practice',
    practice: 'Practice',
    drills: {
      cases: { label: 'Form the case', desc: 'Put nouns into all six cases' },
      conjugation: { label: 'Conjugation', desc: 'Verbs with person endings' },
    },
    wordOfDay: 'Word of the day',
    // Short cue in front of each case form of the word of the day.
    caseCues: { genitive: 'of', instrumental: 'by', comitative: 'with' },
    allCases: 'All seven cases',
    loading: 'Loading the vocabulary…',
  },

  notFound: {
    title: 'Page not found',
    text: 'There is no page at this address. Try one of these:',
  },

  phonology: {
    title: 'Phonology',
    intro: 'Sound system of Буряад хэлэн — vowels, harmony, and consonants.',
    tabsLabel: 'Phonology sections',
    tabs: {
      harmony: 'Vowel Harmony',
      consonants: 'Consonants',
      structure: 'Syllable Structure',
    },
  },

  cases: {
    title: 'Nominal Case System',
    intro:
      'Buryad has 7 cases — suffixes on the noun that replace prepositions and encode grammatical role.',
  },

  verbs: {
    title: 'Verb System',
    intro:
      'Morpheme anatomy, tense, person endings, voice derivation, converbs, and interactive conjugation.',
    tabsLabel: 'Verb sections',
    tabs: {
      anatomy: 'Verb Anatomy',
      tenses: 'Tenses',
      person: 'Person',
      voice: 'Voice & Valency',
      converbs: 'Converbs',
      conjugator: 'Conjugator',
      builder: 'Verb Builder',
    },
  },

  wordOrder: {
    title: 'Syntax & Word Order',
    intro:
      'Subject–Object–Verb (SOV) order, postpositions, pre-nominal modifiers, and agglutinative morphology.',
    tabsLabel: 'Syntax sections',
    tabs: {
      order: 'Word Order',
      questions: 'Questions',
      postpositions: 'Postpositions',
      agglutination: 'Agglutination',
    },
    questions: {
      title: 'Question Structures',
      intro:
        'Questions keep the verb last. The question word need not move to the front, and a particle or ending closes the sentence.',
      questionWord: 'Question word',
      marker: 'Question marker',
      page: (n: number) => `p. ${n}`,
      glossKey:
        'Q question marker · HAB habitual · CVB converb · PC participle · NMLZ nominaliser · COM comitative · REFL reflexive possessive',
      source:
        'Sentences from С. Ц. Сампилова, Ц. Ц. Бальжинимаева, Буряад хэлэн, 3 класс (Улаан-Үдэ: Бэлиг, 2003). Glosses and translations added for this app.',
    },
  },

  vocabulary: {
    title: 'Vocabulary',
    count: (n: number) => `${n} entries`,
    intro: 'Core Buryad lexicon — searchable by Буряад, English, or Russian.',
    search: 'Search vocabulary',
    sort: 'Sort order',
    sortAlpha: 'A–Я alphabetical',
    sortCategory: 'By category',
    clear: 'clear filters',
    empty: 'No words match your search.',
    shown: (n: number, total: number) => `${n} of ${total} entries`,
    categories: {
      noun: 'noun',
      verb: 'verb',
      adjective: 'adjective',
      pronoun: 'pronoun',
      numeral: 'numeral',
      phrase: 'phrase',
      adverb: 'adverb',
      particle: 'particle',
    },
  },

  practice: {
    title: 'Practice',
    intro:
      'Build the forms yourself. Answers come from the same rules and examples as the reference pages; the buttons insert',
    tabsLabel: 'Practice drills',
    tabs: { conjugation: 'Conjugation', cases: 'Cases' },
    loadingVerbs: 'Loading verbs…',
  },
};

// Every language supplies the same keys; functions take the same arguments.
export type Messages = typeof en;
