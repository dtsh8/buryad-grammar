// The rules on the Script page's Rules tab, each with its source and example words the source
// prints (see scriptWords.ts and scriptReading.ts). Poppe = Poppe N. Grammar of Written Mongolian
// (1974); Skorodumova = Скородумова Л. Г. Введение в старописьменный монгольский язык (2000).
// The explanations are interface text, under `script.rules` in the i18n files.
export type ScriptRuleId =
  | 'direction'
  | 'positions'
  | 'parts'
  | 'harmony'
  | 'shared'
  | 'firstSyllable'
  | 'dots'
  | 'apart'
  | 'long'
  | 'spoken';

// Two words that differ only in whether the final vowel is joined or written apart.
export interface ApartPair {
  apart: { latin: string; en: string; ru: string };
  joined: { latin: string; en: string; ru: string; verb?: boolean };
}

export interface ScriptRule {
  id: ScriptRuleId;
  source: string;
  examples: string[];
  // Written form and its colloquial pronunciation (Poppe § 102), for the last rule.
  spoken?: Array<[string, string]>;
  pairs?: ApartPair[];
}

// Skorodumova p. 6; her Russian, our English. The joined words are verb stems (хура- "собираться").
const PAIRS: ApartPair[] = [
  {
    apart: { latin: 'qar-a', en: 'black', ru: 'чёрный' },
    joined: { latin: 'qara', en: 'to look', ru: 'смотреть', verb: true },
  },
  {
    apart: { latin: 'qur-a', en: 'rain', ru: 'дождь' },
    joined: { latin: 'qura', en: 'to gather', ru: 'собираться', verb: true },
  },
  {
    apart: { latin: 'ner-e', en: 'name', ru: 'имя' },
    joined: { latin: 'nere', en: 'distilling', ru: 'перегонка', verb: true },
  },
  {
    apart: { latin: 'ür-e', en: 'fruit, seed', ru: 'плод, семя' },
    joined: { latin: 'üre', en: 'to spend, to rub', ru: 'тратить, тереть', verb: true },
  },
];

export const SCRIPT_RULES: ScriptRule[] = [
  { id: 'direction', source: 'Poppe § 58', examples: ['ene morin sayin buị.'] },
  { id: 'positions', source: 'Poppe §§ 60–63', examples: ['nigen', 'ende', 'naran'] },
  { id: 'parts', source: 'Skorodumova, pp. 4–6', examples: [] },
  { id: 'harmony', source: 'Poppe §§ 32, 99', examples: ['qalaγun', 'kümün', 'nidün'] },
  {
    id: 'shared',
    source: 'Poppe §§ 64, 73, 75, 76, 101',
    examples: ['modun', 'tende', 'ende'],
  },
  { id: 'firstSyllable', source: 'Poppe § 98', examples: ['öndür', 'ebügen', 'kümün'] },
  { id: 'dots', source: 'Poppe §§ 68, 98', examples: ['naran', 'qalaγun', 'tarbaγan', 'čaγ'] },
  {
    id: 'apart',
    source: 'Poppe §§ 87–88; Skorodumova, p. 6',
    examples: ['qaγalγ-a', 'baγ-a', 'kümün-ü', 'ulus-i'],
    pairs: PAIRS,
  },
  { id: 'long', source: 'Poppe §§ 89, 92', examples: ['bilegüü', 'sayin'] },
  {
    id: 'spoken',
    source: 'Poppe § 102',
    examples: [],
    spoken: [
      ['aγula', 'ūla'],
      ['edür', 'ödür'],
      ['šira', 'šara'],
      ['miqan', 'maxa'],
      ['modun', 'modu'],
    ],
  },
];
