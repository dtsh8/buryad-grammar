// Reading practice for the Script page: example sentences from Poppe N. Grammar of Written
// Mongolian (Wiesbaden, 1974), §§ 442–443, pp. 125–126, in his transliteration. ị is his
// non-syllabic i: a diphthong, written with y inside a word (Poppe § 92). The English is his;
// the Russian is ours.
export interface ReadingSentence {
  latin: string;
  en: string;
  ru: string;
  page: number;
}

export const SCRIPT_READING: ReadingSentence[] = [
  { latin: 'baγši irebeị.', en: 'The teacher has come.', ru: 'Учитель пришёл.', page: 125 },
  { latin: 'bi ende saγuǰu amuị.', en: 'I am living here.', ru: 'Я живу здесь.', page: 125 },
  { latin: 'šabi ungšiǰu amuị.', en: 'The pupil is reading.', ru: 'Ученик читает.', page: 125 },
  {
    latin: 'šibaγun nisün irebe.',
    en: 'The bird flew in. (Lit., “came flying.”)',
    ru: 'Прилетела птица (букв. «пришла летя»).',
    page: 126,
  },
  {
    latin: 'ebügen güịn γaruba.',
    en: 'The old man ran out.',
    ru: 'Старик выбежал.',
    page: 126,
  },
  {
    latin: 'tanu köbegün baγši bolba.',
    en: 'Your son became a teacher.',
    ru: 'Ваш сын стал учителем.',
    page: 126,
  },
  {
    latin: 'ene morin sayin buị.',
    en: 'This horse is good.',
    ru: 'Эта лошадь хорошая.',
    page: 126,
  },
  { latin: 'ene kümün ken buị?', en: 'Who is this person?', ru: 'Кто этот человек?', page: 126 },
  {
    latin: 'kümün-ü erdem γurban buị.',
    en: 'Man’s virtues are three.',
    ru: 'Добродетелей у человека три.',
    page: 126,
  },
  {
    latin: 'suruγsan dalaị, suruγ-a ügeị balaị.',
    en: 'One who has learnt is an ocean (of wisdom), one who has not learnt is blind.',
    ru: 'Учившийся — океан (мудрости), не учившийся — слепец.',
    page: 126,
  },
  { latin: 'nasun inu tabun.', en: 'His age is five.', ru: 'Ему пять лет.', page: 126 },
];
