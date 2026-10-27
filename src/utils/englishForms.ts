// ─── English verb form helper ─────────────────────────────────────────────
// Returns past tense, past participle, and gerund for any English verb.
// Used to generate grammatically correct English glosses in the Verb Builder.

export interface EnglishForms {
  past: string; // "went", "loved", "played"
  pastPart: string; // "gone", "loved", "played"
  gerund: string; // "going", "loving", "playing"
}

// Irregular forms table — past tense + past participle
// Covers the verbs most likely to be entered in the Verb Builder
const IRREGULAR: Record<string, [string, string]> = {
  be: ['was/were', 'been'],
  become: ['became', 'become'],
  begin: ['began', 'begun'],
  bite: ['bit', 'bitten'],
  break: ['broke', 'broken'],
  bring: ['brought', 'brought'],
  build: ['built', 'built'],
  buy: ['bought', 'bought'],
  catch: ['caught', 'caught'],
  choose: ['chose', 'chosen'],
  come: ['came', 'come'],
  cut: ['cut', 'cut'],
  do: ['did', 'done'],
  draw: ['drew', 'drawn'],
  drink: ['drank', 'drunk'],
  drive: ['drove', 'driven'],
  eat: ['ate', 'eaten'],
  fall: ['fell', 'fallen'],
  feel: ['felt', 'felt'],
  fight: ['fought', 'fought'],
  find: ['found', 'found'],
  fly: ['flew', 'flown'],
  forget: ['forgot', 'forgotten'],
  get: ['got', 'gotten'],
  give: ['gave', 'given'],
  go: ['went', 'gone'],
  grow: ['grew', 'grown'],
  have: ['had', 'had'],
  hear: ['heard', 'heard'],
  hold: ['held', 'held'],
  keep: ['kept', 'kept'],
  know: ['knew', 'known'],
  lead: ['led', 'led'],
  leave: ['left', 'left'],
  lend: ['lent', 'lent'],
  let: ['let', 'let'],
  lie: ['lay', 'lain'],
  lose: ['lost', 'lost'],
  make: ['made', 'made'],
  mean: ['meant', 'meant'],
  meet: ['met', 'met'],
  pay: ['paid', 'paid'],
  put: ['put', 'put'],
  read: ['read', 'read'],
  ride: ['rode', 'ridden'],
  rise: ['rose', 'risen'],
  run: ['ran', 'run'],
  say: ['said', 'said'],
  see: ['saw', 'seen'],
  sell: ['sold', 'sold'],
  send: ['sent', 'sent'],
  set: ['set', 'set'],
  show: ['showed', 'shown'],
  sing: ['sang', 'sung'],
  sit: ['sat', 'sat'],
  sleep: ['slept', 'slept'],
  speak: ['spoke', 'spoken'],
  spend: ['spent', 'spent'],
  stand: ['stood', 'stood'],
  steal: ['stole', 'stolen'],
  swim: ['swam', 'swum'],
  take: ['took', 'taken'],
  teach: ['taught', 'taught'],
  tell: ['told', 'told'],
  think: ['thought', 'thought'],
  throw: ['threw', 'thrown'],
  understand: ['understood', 'understood'],
  wake: ['woke', 'woken'],
  wear: ['wore', 'worn'],
  win: ['won', 'won'],
  write: ['wrote', 'written'],
};

// Regular past-tense rules:
//   ends in -e           → +d         (love → loved)
//   ends in consonant y  → -y +ied    (carry → carried)  [rare for base form]
//   ends in CVC pattern  → double+ed  (stop → stopped, sit: irregular)
//   otherwise            → +ed
function regularPast(v: string): string {
  if (/e$/.test(v)) return v + 'd';
  if (/[^aeiou]y$/.test(v)) return v.slice(0, -1) + 'ied';
  if (needsDoubling(v)) return v + v[v.length - 1] + 'ed';
  return v + 'ed';
}

// Gerund rules:
//   ends in -ie          → +ing       (lie → lying is irregular; skip edge case)
//   ends in -e           → drop e +ing (love → loving, make → making)
//   CVC                  → double+ing  (run → running, sit: irregular)
//   otherwise            → +ing
function regularGerund(v: string): string {
  if (/[^e]e$/.test(v)) return v.slice(0, -1) + 'ing'; // love→loving, make→making
  if (/ee$/.test(v)) return v + 'ing'; // see→seeing (irregular anyway), flee→fleeing
  if (needsDoubling(v)) return v + v[v.length - 1] + 'ing';
  return v + 'ing';
}

// CVC doubling: single-syllable verb ending consonant-vowel-consonant
// (and that consonant is not w, x, y)
function needsDoubling(v: string): boolean {
  return /^[^aeiou]*[aeiou][bcdfghjklmnprstvz]$/i.test(v) && v.length <= 5;
}

export function englishForms(verb: string): EnglishForms {
  const key = verb.toLowerCase().trim();
  const irreg = IRREGULAR[key];
  if (irreg) {
    return {
      past: irreg[0],
      pastPart: irreg[1],
      gerund: regularGerund(key), // gerund is usually regular even for irregulars
    };
  }
  const past = regularPast(key);
  return {
    past,
    pastPart: past, // regular verbs: past = past participle
    gerund: regularGerund(key),
  };
}
