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
    reader: 'Reader',
  },

  sections: {
    overview: { label: 'Overview', desc: 'Language profile and typology' },
    phonology: { label: 'Phonology', desc: 'Vowel harmony, consonants, long vowels' },
    cases: { label: 'Cases', desc: '7 nominal cases with endings and examples' },
    verbs: { label: 'Verbs', desc: 'Tense, person endings, converbs' },
    modals: { label: 'Modals', desc: 'Must, can, may and their negatives' },
    wordOrder: { label: 'Word Order', desc: 'SOV, postpositions, modifiers' },
    vocabulary: { label: 'Vocabulary', desc: 'Core words, phrases and numerals' },
    reader: { label: 'Reader', desc: 'Hover over Buryad words to translate them' },
    script: { label: 'Old Script', desc: 'The vertical Mongolian script: write and read' },
    practice: { label: 'Practice', desc: 'Conjugation and case drills' },
  },

  say: { listen: 'Listen', play: (word: string) => `Play pronunciation of ${word}` },
  attest: {
    found: (count: string) => `Found ${count} times in the Buryat National Corpus.`,
    notFound: 'Not found in the Buryat National Corpus. Built by rule: it may be rare or unused.',
    foundLabel: 'Found in the corpus:',
    notFoundBadge: 'not found',
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
    guide: {
      title: 'How to make the sounds',
      intro: 'Consonants differ by where the air is blocked. Choose a place to see it.',
      diagramLabel: 'Side view of the mouth',
      placesLabel: 'Places of articulation',
      places: {
        bilabial: { name: 'bilabial', how: 'Both lips touch.' },
        alveolar: {
          name: 'alveolar',
          how: 'The tongue touches or nears the upper teeth and the ridge behind them.',
        },
        postalveolar: {
          name: 'postalveolar',
          how: 'The front of the tongue rises just behind the ridge of the upper teeth.',
        },
        palatal: {
          name: 'palatal',
          how: 'The middle of the tongue rises towards the hard palate.',
        },
        velar: {
          name: 'velar',
          how: 'The back of the tongue rises towards the roof of the mouth, further back.',
        },
        pharyngeal: {
          name: 'pharyngeal',
          how: 'The root of the tongue narrows the throat against its back wall.',
        },
      },
    },
    vowelGuide: {
      diagram: {
        title: 'How to shape the vowels',
        intro: 'Choose a vowel to see the tongue and lips.',
        label: 'Side view of the mouth',
        vowelsLabel: 'Vowels',
        wide: 'Mouth wide',
        narrow: 'Mouth narrow',
        rounded: 'lips rounded',
        unrounded: 'lips unrounded',
        schematic:
          'A schematic drawing based on written descriptions, not a measurement. The dot marks the highest part of the tongue.',
      },
      title: 'What the vowel groups mean',
      groups:
        'Back or male (эрэ), front or female (эмэ) and neutral (эрсэ) are traditional names. They tell you which suffixes a word takes, and are a poor guide to the tongue: ү, a front vowel, sounds close to Russian у. Learn each vowel from its own note below.',
      lips: 'Labial vowels are said with rounded lips: о, у, өө, ү. Unrounded: а, э, и.',
      reduced:
        'Short vowels after the first syllable are very brief and unclear, and in the middle of a word can drop out: дуратай sounds close to дуртай.',
      stress: 'The stress falls on the syllable before -гүй, not on -гүй itself: ябаха-гүй.',
      ipa: 'The IPA for у, ү, ө and э is under review: the sources point to other symbols.',
    },
    sources:
      "Notes follow Учебник бурятского языка, pp. 1–4, Khabtagaeva & Kempf 2011, pp. 27–28, and Жаргал Бадагаров's lessons Буряадаар дуугараял.",
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

  modals: {
    title: 'Modal Words',
    intro:
      'How to say must, need, can and may: хэрэгтэй, ёһотой, аргатай, болохо, шадаха, and what happens when you negate them.',
    tabsLabel: 'Modal word sections',
    tabs: { map: 'The map', forms: 'The words', negation: 'Negation' },
    square: {
      title: 'The four corners',
      intro:
        'Every modal meaning sits in one of four corners. Each corner is the exact negation of the corner across from it. Choose a corner to see its opposite.',
      corners: { must: 'Must', mustNot: 'Must not', may: 'Can, may', needNot: 'Need not' },
      opposite: 'exact opposite:',
      warning:
        'Trap: “not obliged to go” is хэрэггүй. ёһогүй looks like the negative of ёһотой, but it means “must not go”.',
    },
    frames: {
      title: 'Two sentence patterns',
      intro:
        'Check the form of the main verb first. It decides how the modal behaves and where the person ending goes.',
      familyHa: '-ха + a predicate word',
      familyHaText: 'хэрэгтэй, ёһотой, аргатай: the word itself is the predicate.',
      familyZha: '-жа + a verb',
      familyZhaText: 'болохо, шадаха: an auxiliary verb carries negation and tense.',
      roles: { subject: 'Who', verb: 'Main verb', modal: 'Modal', ending: 'Person ending' },
    },
    pair: {
      title: 'хэрэгтэй or ёһотой?',
      intro:
        'One sentence, two words. хэрэгтэй is advice or a need; ёһотой is a duty and is stronger.',
      advice: 'Advice',
      duty: 'Duty',
    },
    entry: {
      meaning: 'Meaning',
      who: 'Who acts',
      example: 'Example',
      negative: 'Negative',
      past: 'Past',
    },
    relatives: { title: 'Related forms', word: 'Form', meaning: 'Meaning', example: 'Example' },
    negation: {
      tableTitle: 'Where the negation goes',
      tableIntro:
        'The negation can land in up to three places, and they do not all mean the same thing.',
      word: 'Positive',
      onModal: 'On the modal',
      onVerb: 'On the main verb',
      withBeshe: 'With бэшэ',
      usage: 'In use',
      doubleTitle: 'Two negatives make a must',
      doubleIntro:
        'Read from the inside out. Each box negates everything inside it, so the sentence ends up as a strong obligation.',
      trapsTitle: 'Traps',
    },
    glossKey:
      'INF -ха form · CVB -жа converb · PERF -аа form · NEG negative · DAT dative · 1SG first person',
    source:
      'Sources: Textbook; Khabtagaeva & Kempf 2011 (K&K); ТСБЯ 2022 (volume:page); Дамбуева 2020; Buryat National Corpus. Sample figures come from random samples of up to 100 sentences.',
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

  reader: {
    title: 'Reader',
    intro:
      "Paste Buryad text and try to work out each sentence. Hover over a word (or tap it) for a hint, and show the translation when you're ready.",
    inputLabel: 'Buryad text',
    legend:
      'Words with a solid underline are in the checked vocabulary, so inflected forms are traced back to their headword. Dotted words are looked up online and are not checked: first in the Burlang dictionary, then with Google Translate. Burlang gives Russian, which Google puts into English. Shaded words form a phrase, translated by Google on hover. Sentence translations are also Google\'s, sent only when you show them. Whatever is translated this way is sent to those services. Word types come from the vocabulary and the explanatory dictionary (А–Р only); "probably" is a guess from the ending.',
    looking: 'Translating…',
    phrase: 'Phrase',
    showTranslation: 'Show translation',
    probably: (label: string) => `probably ${label}`,
    kinds: { participle: 'participle', converb: 'converb' },
    hideTranslation: 'Hide translation',
    ties: {
      show: 'Explain the participle',
      hide: 'Hide the explanation',
      roles: {
        object: 'object',
        maybeObject: 'object?',
        doer: 'doer',
        participle: 'participle',
        noun: 'noun it describes',
      },
      object: (object: string, participle: string, noun: string) =>
        `${object} is the object of ${participle}: the action is done to it, and the accusative ending shows that. With the object in place, ${noun} is not what the action is done to. It names who does it, or sometimes where or when it happens.`,
      bareObject: (object: string, participle: string, noun: string) =>
        `${object} has no case ending, but it can still be the object of ${participle}: Buryad often leaves objects unmarked. If it is, ${noun} names who does the action, or where or when it happens.`,
      doer: (doer: string, participle: string, noun: string) =>
        `${doer} is genitive. Before ${participle} that usually names who does the action, so ${noun} is usually what it is done to: the object, with no accusative ending of its own. The genitive can also just say whose ${noun} it is.`,
      open: (noun: string) =>
        `Nothing here is marked as the object, so ${noun} itself may be it. Try both readings: it does the action, as in ерэһэн багша "the teacher who came", or the action is done to it, as in хэлэһэн үгэ "the word that was said".`,
      nounCase: (noun: string, name: string) =>
        `Case of ${noun}: ${name}. This ending ties the whole phrase to the rest of the sentence. It says nothing about how ${noun} relates to the participle.`,
    },
    sources: {
      burlang: 'Burlang dictionary',
      burlangMachine: 'Burlang, machine-translated',
      machine: 'machine translation',
    },
    notFound: 'No translation found',
  },

  script: {
    title: 'Old Mongolian Script',
    intro:
      'Until 1931 Buryads wrote in the vertical Mongolian script (Poppe 1974, § 7). It runs top to bottom in columns from left to right, and a letter changes shape with its place in the word, so one shape can stand for several sounds. Hover over a letter (or tap it) to see which sound it writes there.',
    writeTitle: 'Write a word',
    inputLabel: 'Transliteration or Buryad Cyrillic',
    inputHint:
      'Transliteration: a e i o u ö ü, n ng, b p, q γ (gh), k g, m l, s š (sh), t d, č (ch), ǰ (j), y r w. A hyphen writes a suffix apart: kümün-ü, suruγ-a.',
    readAs: 'Read as',
    cyrillicNote:
      'Cyrillic is converted by sound, so apart from the words in the table below it is only a first guess: the script keeps older spellings, and хүн is written kümün. Edit the transliteration to correct it.',
    editLatin: 'Edit the transliteration',
    letters: 'Letter by letter',
    positions: {
      isolated: 'alone',
      initial: 'initial',
      medial: 'medial',
      final: 'final',
    },
    sound: (latin: string, cyrillic: string) => `Sound: ${latin} (≈ ${cyrillic})`,
    position: (position: string) => `Position: ${position}`,
    detached: 'written apart from the word',
    alsoReads: (sounds: string) => `In this position the same shape can also be ${sounds}.`,
    unique: 'In this position no other sound has this shape.',
    spokenTitle: 'Spoken and written',
    spokenIntro:
      'The script keeps the spelling of older Mongolian, so a Buryad word is often written quite differently from how it sounds.',
    columns: { buryad: 'Buryad', written: 'Written', script: 'Script', source: 'Poppe' },
    readingTitle: 'Reading',
    readingIntro:
      "Sentences from Poppe's Grammar of Written Mongolian (pp. 125–126). Read each column first, then check yourself.",
    showReading: 'Show the transliteration and translation',
    hideReading: 'Hide',
    source: 'Source: N. Poppe, Grammar of Written Mongolian (Wiesbaden, 1974), §§ 60–102.',
    fontNote:
      'The letters use the Noto Sans Mongolian font. If they look like separate boxes, the font did not load.',
    tabsLabel: 'Script sections',
    tabs: { write: 'Write and read', rules: 'Rules and game', hand: 'Handwriting' },
    rulesIntro:
      'The main rules of the script, after Poppe. Hover over any letter in the examples to see what it writes.',
    rules: {
      direction: {
        title: 'Direction',
        body: 'The script runs top to bottom, and the columns follow each other from left to right (§ 58). ᠂ is a comma and ᠃ a full stop.',
      },
      positions: {
        title: 'A letter changes with its place',
        body: 'Most letters have an initial, a medial and a final shape, and initial vowels get an extra stroke at the top (§ 60). Pick a letter below to see its shapes.',
      },
      parts: {
        title: 'Parts of letters',
        body: 'Letters are built from parts that have names of their own: the crown, the tooth, the spine that runs through a word, shins, bellies, horns and ears. Two of them are the two ways a word can end in a or e: сүүл "tail", joined to the word, and орхиц, written apart (p. 6). Pick a part to see it written stroke by stroke.',
      },
      harmony: {
        title: 'Back and front words',
        body: 'A word has either back vowels (a, o, u) or front vowels (e, ö, ü); i goes with both (§ 32). q and γ occur only in back-vowel words, k and g in front-vowel ones, so the vowels tell you how to read the consonants (§ 99).',
      },
      shared: {
        title: 'One shape, two sounds',
        body: 'Some sounds are never told apart: o and u, ö and ü, t and d, and y and ǰ at the start of a word; k and g share one letter (§§ 73, 75, 76). Only knowing the word tells you which is meant (§ 101), so the game accepts either.',
      },
      firstSyllable: {
        title: 'ö and ü after the first syllable',
        body: 'ö and ü have an extra tooth only in the first syllable. After it they look just like o and u (§ 98).',
      },
      dots: {
        title: 'Dots',
        body: 'n has a dot before a vowel. γ has two dots between vowels, but none before a consonant or at the end of a word (§ 68).',
      },
      apart: {
        title: 'Written apart',
        body: 'After q, γ, s, l, m or r a final a or e is usually written apart from the word (§ 87). Case endings are always written apart (§ 88). The transliteration marks both with a hyphen.',
      },
      long: {
        title: 'Long vowels and diphthongs',
        body: 'Long ū, ü and ī are written with doubled letters (§ 89). Inside a word the diphthongs ai, ei, oi, ui are written ayi, eyi, oyi, uyi (§ 92).',
      },
      spoken: {
        title: 'Written is not spoken',
        body: 'The script keeps old spellings, and readers pronounce them their own way (§ 102): groups like aγa became long vowels, an i in the first syllable took on the next vowel, and a final n is often dropped.',
      },
    },
    explorer: {
      label: 'Letter',
      note: 'Each shape is drawn from the letter alone. Inside a word its neighbours can change it further.',
    },
    pairs: {
      title: 'Joined or apart?',
      intro:
        'Sometimes the only difference between two words is whether the final a or e is joined (сүүл) or written apart (орхиц). What does this word mean?',
      apart: 'written apart',
      joined: 'joined',
      right: 'Right!',
      wrong: (answer: string) => `Not this time: it means “${answer}”.`,
      another: 'Another word',
      score: (right: number, total: number) => `${right} of ${total} right`,
      conflict:
        'Poppe prints “black” joined (qara, p. 21). Skorodumova writes it apart and reads the joined form as “to look”; the quiz follows her.',
    },
    strokes: {
      label: 'Letter part',
      replay: 'Write it again',
      note: 'Redrawn from Skorodumova’s handwritten table (pp. 4–5). The dot marks where the pen starts; colours show the strokes in order.',
    },
    hand: {
      intro:
        'Write with a finger, a pen or the mouse, top to bottom. Nothing you draw leaves your device.',
      modesLabel: 'Handwriting mode',
      modes: { recognise: 'Write letters', trace: 'Trace' },
      canvasLabel: 'Writing area',
      undo: 'Undo stroke',
      clear: 'Clear',
      recognise: 'Recognise',
      recogniseIntro:
        'Write one letter at a time, in the shape it has in its place in the word, then press Recognise and pick its sound. A shape the script uses for several sounds offers them all.',
      loading: 'Loading the letter shapes…',
      loadError: 'Could not load the letter shapes.',
      matches: 'Closest shapes',
      noMatch: 'Draw a letter first.',
      word: 'Your word',
      emptyWord: 'Pick a sound to start a word.',
      deleteLast: 'Delete last',
      clearWord: 'Clear word',
      traceIntro:
        'Trace over the grey shape. The score is how closely your lines follow it. For a letter part, start at the dot and keep the stroke order.',
      targetLabel: 'What to trace',
      targets: { word: 'A word', part: 'A letter part' },
      newWord: 'New word',
      check: 'Check',
      order: {
        right: (n: number) => `Stroke ${n}: right`,
        reversed: (n: number) => `Stroke ${n}: drawn the other way`,
        missing: (n: number) => `Stroke ${n}: missing`,
        extra: (n: number) => `${n} stroke(s) more than the part has`,
      },
      fontNote:
        'Shapes are compared with those of the Noto Sans Mongolian font, the one this page uses, so clear, print-like letters are recognised best.',
    },
    game: {
      title: 'Spelling game',
      intro:
        'Ten words from Poppe. Spell each in the old script with the letter keys or by typing the transliteration. Your score is the share of letters you get right.',
      modes: { write: 'Write the word', read: 'Read the script' },
      modesLabel: 'Game mode',
      writePrompt: 'Write in the old script:',
      readPrompt: 'Read this word and spell its letters:',
      answerLabel: 'Your spelling (transliteration)',
      keysLabel: 'Script letters',
      apart: 'apart',
      backspace: 'Delete',
      check: 'Check',
      next: 'Next word',
      finish: 'See the result',
      again: 'Play again',
      progress: (n: number, total: number) => `Word ${n} of ${total}`,
      average: 'Average',
      verdict: (percent: number): string =>
        percent === 100
          ? 'Perfect!'
          : percent >= 80
            ? 'Very close'
            : percent >= 50
              ? 'Halfway there'
              : 'Keep practising',
      answer: 'Written form',
      marks: {
        right: 'right',
        sameShape: 'other sound, same shape: counts as right',
        wrong: 'wrong letter',
        missing: 'missing',
        extra: 'extra',
      },
      done: (percent: number) => `Round over: ${percent}% on average.`,
    },
  },

  practice: {
    title: 'Practice',
    intro:
      'Build the forms yourself. Answers come from the same rules and examples as the reference pages; the buttons insert',
    tabsLabel: 'Practice drills',
    tabs: { conjugation: 'Conjugation', cases: 'Cases' },
    loadingVerbs: 'Loading verbs…',
    score: 'Score',
    streak: 'Streak',
    verdict: {
      correct: 'Correct',
      almost: 'Almost: mind the Buryad letters',
      wrong: 'Not quite',
    },
    yourAnswer: 'Your answer',
    placeholder: 'Type the form…',
    insert: (letter: string) => `Insert ${letter}`,
    check: 'Check',
    next: 'Next',
    tenses: { prs: 'Present', pst: 'Simple Past', perf: 'Perfect', inf: 'Future' },
    persons: {
      '1sg': '1sg',
      '2sg': '2sg',
      '3sg': '3sg',
      '1pl': '1pl',
      '2pl / polite': '2pl / polite',
      '3pl': '3pl',
    },
    conjugate: { before: 'Conjugate', after: 'for the subject:' },
    verbMeaning: (meaning: string) => `“to ${meaning}”`,
    personEnding: 'person ending',
    noEnding: 'with no ending for 3sg',
    personEndings: 'Person endings',
    formCase: 'Form the case',
    nameCase: 'Name the case',
    putInto: {
      before: 'Put this noun into the',
      after: (meaning: string) => `case, meaning “${meaning}”:`,
    },
    whichCase: { before: 'Which case is this form of', after: '?' },
    quoted: (text: string) => `“${text}”`,
    builtByRule: 'Built by rule.',
    dropsN: 'drops its н in this case.',
    suffix: 'Suffix:',
  },
};

// Every language supplies the same keys; functions take the same arguments.
export type Messages = typeof en;
