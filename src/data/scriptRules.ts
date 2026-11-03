// The rules on the Script page's Rules tab, each with its section in Poppe N. Grammar of Written
// Mongolian (1974) and example words he prints (see scriptWords.ts and scriptReading.ts). The
// explanations are interface text, under `script.rules` in the i18n files.
export type ScriptRuleId =
  | 'direction'
  | 'positions'
  | 'harmony'
  | 'shared'
  | 'firstSyllable'
  | 'dots'
  | 'apart'
  | 'long'
  | 'spoken';

export interface ScriptRule {
  id: ScriptRuleId;
  poppe: string;
  examples: string[];
  // Written form and its colloquial pronunciation (Poppe § 102), for the last rule.
  spoken?: Array<[string, string]>;
}

export const SCRIPT_RULES: ScriptRule[] = [
  { id: 'direction', poppe: '§ 58', examples: ['ene morin sayin buị.'] },
  { id: 'positions', poppe: '§§ 60–63', examples: ['nigen', 'ende', 'naran'] },
  { id: 'harmony', poppe: '§§ 32, 99', examples: ['qalaγun', 'kümün', 'nidün'] },
  { id: 'shared', poppe: '§§ 64, 73, 75, 76, 101', examples: ['modun', 'tende', 'ende'] },
  { id: 'firstSyllable', poppe: '§ 98', examples: ['öndür', 'ebügen', 'kümün'] },
  { id: 'dots', poppe: '§§ 68, 98', examples: ['naran', 'qalaγun', 'tarbaγan', 'čaγ'] },
  { id: 'apart', poppe: '§§ 87–88', examples: ['qaγalγ-a', 'baγ-a', 'kümün-ü', 'ulus-i'] },
  { id: 'long', poppe: '§§ 89, 92', examples: ['bilegüü', 'sayin'] },
  {
    id: 'spoken',
    poppe: '§ 102',
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
