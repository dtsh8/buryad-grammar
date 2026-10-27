// ─── Buryad Verb Morphology Engine ────────────────────────────────────────
// Sources: Skribnik (2003) Buryat · Poppe (1960) Buriat Grammar

export type Harmony = 'back' | 'front';

const BACK_VOWELS = /[аоу]/;
const FRONT_VOWELS = /[эөү]/;

export function detectHarmony(root: string): Harmony {
  for (let i = root.length - 1; i >= 0; i--) {
    if (BACK_VOWELS.test(root[i])) return 'back';
    if (FRONT_VOWELS.test(root[i])) return 'front';
  }
  return 'back';
}

export function endsInVowel(root: string): boolean {
  return /[аоуэөүи]$/.test(root);
}

// Strip infinitive suffix -ха / -хэ / -хо to get root
export function extractRoot(infinitive: string): string {
  return infinitive.replace(/[;،.。\s]+$/, '').replace(/хо$|ха$|хэ$/, '');
}

// ─── Suffix helpers ────────────────────────────────────────────────────────
// Buryad verbal suffixes are 3-way harmonic based on the last significant vowel:
//   а-class (а, у roots) → а-variants: -ха -на -ба -лай -даг -жа
//   о-class (о roots)       → о-variants: -хо -но -бо -лой -дог -жо   (орохо, ороно etc.)
//   э-class (э, ө, ү roots) → э-variants: -хэ -нэ -бэ -лэй -дэг -жэ
//
// Sequential converb is a separate 4-way system (see seqConvSuffix).

// SufClass: which suffix vowel template to use
type SufClass = 'а' | 'о' | 'э';

// Scan RTL past transparent sounds to find the last significant vowel,
// then map to a suffix class:
//   у → а-class (у is back but uses а-variants, confirmed: һуу → һуугаад)
//   о → о-class (confirmed: оро → ороно, оробо, etc.)
//   э/ө/ү → э-class
function getSufClass(root: string): SufClass {
  for (let i = root.length - 1; i >= 0; i--) {
    const c = root[i];
    if (c === 'а' || c === 'у') return 'а'; // back unrounded + high back rounded
    if (c === 'о') return 'о'; // back rounded mid
    if (FRONT_VOWELS.test(c)) return 'э'; // any front vowel
    // и, й, consonants are transparent
  }
  return 'а'; // default
}

// Pick the correct suffix variant for this class.
function sufC(cls: SufClass, а: string, о: string, э: string): string {
  if (cls === 'о') return о;
  if (cls === 'э') return э;
  return а;
}

// Keep 2-way suf() for back/front derivational suffix selection in deriveAll.
function suf(harmony: Harmony, back: string, front: string): string {
  return harmony === 'back' ? back : front;
}

// Vowel absorption: drop the duplicate leading vowel when root ends in the
// same character as the suffix starts (яба + аад → ябаад, үлэ + ээд → үлээд, оро + оод → ороод).
function attach(root: string, suffix: string): string {
  if (suffix.length > 0 && root[root.length - 1] === suffix[0]) {
    return root + suffix.slice(1);
  }
  return root + suffix;
}

// Returns true when epenthetic г must be inserted before the suffix.
// Two environments (Skribnik 2003):
//   • Long-vowel endings (аа оо уу ии ээ өө үү): угаа → угаагаад
//   • Semivowel й:                                   бай  → байгаад
function needsEpentheticG(root: string): boolean {
  if (root.endsWith('й')) return true;
  if (root.length >= 2) {
    const last = root[root.length - 1];
    const prev = root[root.length - 2];
    if (last === prev && /[аоуэөүи]/.test(last)) return true;
  }
  return false;
}

// Sequential converb — 4-way harmony (the seq.conv suffix is more specific than
// other suffixes because its vowel directly mirrors the root vowel):
//   а/у → -аад   ябаад, һуугаад ✓
//   о    → -оод   ороод ✓  (attachment absorbs duplicate о)
//   э    → -ээд   үлээд ✓  (attachment absorbs duplicate э)
//   ө/ү → -өөд
// и / й / consonants are transparent.
function seqConvSuffix(root: string): string {
  for (let i = root.length - 1; i >= 0; i--) {
    const c = root[i];
    if (c === 'а' || c === 'у') return 'аад'; // а / у → аад
    if (c === 'о') return 'оод'; // о → оод
    if (c === 'э') return 'ээд'; // э → ээд
    if (FRONT_VOWELS.test(c)) return 'өөд'; // ө/ү → өөд
  }
  return 'аад';
}

export function conjugate(root: string) {
  const cls = getSufClass(root);
  const seqSuf = seqConvSuffix(root);
  const seqConv = needsEpentheticG(root) ? root + 'г' + seqSuf : attach(root, seqSuf);
  return {
    inf: root + sufC(cls, 'ха', 'хо', 'хэ'),
    prs: root + sufC(cls, 'на', 'но', 'нэ'),
    pst: root + sufC(cls, 'ба', 'бо', 'бэ'),
    evidPst: root + sufC(cls, 'лай', 'лой', 'лэй'),
    hab: root + sufC(cls, 'даг', 'дог', 'дэг'),
    neg: root + sufC(cls, 'дагүй', 'догүй', 'дэгүй'),
    simConv: root + sufC(cls, 'жа', 'жо', 'жэ'),
    seqConv,
  };
}

// ─── Derivation rules ──────────────────────────────────────────────────────

export interface DerivedForm {
  label: string;
  buryad: string;
  suffix: string;
  description: string;
  englishRole: string;
  root: string;
  inf: string;
  prs: string;
  pst: string;
  evidPst: string;
  hab: string;
  neg: string;
  simConv: string;
  seqConv: string;
  exampleSentence: { buryad: string; gloss: string; translation: string };
  color: string;
}

export function deriveAll(baseRoot: string, baseMeaning: string): DerivedForm[] {
  const h = detectHarmony(baseRoot);
  const v = endsInVowel(baseRoot);
  const needsG = needsEpentheticG(baseRoot);

  const make = (
    label: string,
    buryad: string,
    derivRoot: string,
    suffix: string,
    desc: string,
    engRole: string,
    color: string,
    sentence: DerivedForm['exampleSentence']
  ): DerivedForm => ({
    label,
    buryad,
    suffix,
    description: desc,
    englishRole: engRole,
    root: derivRoot,
    color,
    exampleSentence: sentence,
    ...conjugate(derivRoot),
  });

  // Causative: suffix уул/үүл is vowel-initial.
  // Rule depends on what the root ends in:
  //   • short-vowel final (а/о/э/…): drop theme vowel, attach уул/үүл
  //     яба → яб+уул = ябуул ✓  оро → ор+уул = оруул ✓
  //   • long-vowel or й final: keep root, insert epenthetic г
  //     угаа → угаа+г+уул = угаагуул ✓
  //   • consonant final: attach directly
  //     хүдэл → хүдэл+үүл = хүдэлүүл ✓
  const causVoiceSuffix = suf(h, 'уул', 'үүл');
  const causRoot = needsG
    ? baseRoot + 'г' + causVoiceSuffix // long vowel / й
    : v
      ? baseRoot.slice(0, -1) + causVoiceSuffix // short vowel: drop theme vowel
      : baseRoot + causVoiceSuffix; // consonant final: direct
  // Passive: г-initial suffix гда/гдэ already provides the buffer consonant.
  const passRoot = v ? baseRoot + suf(h, 'гда', 'гдэ') : baseRoot + suf(h, 'агда', 'эгдэ');
  // Reflexive / reciprocal / cooperative: consonant-initial suffixes — no г needed.
  const reflRoot = baseRoot + suf(h, 'да', 'дэ');
  const recipRoot = v ? baseRoot + suf(h, 'лса', 'лсэ') : baseRoot + suf(h, 'алса', 'элсэ');
  const coopRoot = v ? baseRoot + suf(h, 'лда', 'лдэ') : baseRoot + suf(h, 'алда', 'элдэ');

  return [
    make(
      'Causative',
      'Үйлдүүлэгшэ',
      causRoot,
      // Display suffix reflects the actual transformation applied:
      needsG ? suf(h, '-гуул', '-гүүл') : v ? suf(h, '-уул', '-үүл') : suf(h, '+уул', '+үүл'),
      `Cause or allow someone else to "${baseMeaning}".`,
      'make / let someone do',
      'bg-amber-50 border-amber-300',
      {
        buryad: `Би тэрэниие ${conjugate(causRoot).prs}.`,
        gloss: `I him.ACC ${causRoot}-PRS`,
        translation: `I make him ${baseMeaning}.`,
      }
    ),
    make(
      'Passive',
      'Эдлүүлэгшэ',
      passRoot,
      v ? suf(h, '-гда', '-гдэ') : suf(h, '-агда', '-эгдэ'),
      `Subject undergoes "${baseMeaning}" — agent demoted or absent.`,
      'be done (to)',
      'bg-mongol-50 border-mongol-300',
      {
        buryad: `Энэ ${conjugate(passRoot).prs}.`,
        gloss: `this ${passRoot}-PRS`,
        translation: `This is (being) ${baseMeaning}ed.`,
      }
    ),
    make(
      'Reflexive',
      'Бэеэ үйлдэхэ',
      reflRoot,
      suf(h, '-да', '-дэ'),
      `Subject "${baseMeaning}s" on itself.`,
      'do to oneself',
      'bg-green-50 border-green-300',
      {
        buryad: `Тэрэ ${conjugate(reflRoot).prs}.`,
        gloss: `he/she ${reflRoot}-PRS`,
        translation: `He/She ${baseMeaning}s himself/herself.`,
      }
    ),
    make(
      'Reciprocal',
      'Хэлсэлэй',
      recipRoot,
      v ? suf(h, '-лса', '-лсэ') : suf(h, '-алса', '-элсэ'),
      `Two or more subjects "${baseMeaning}" each other mutually.`,
      'do to each other',
      'bg-purple-50 border-purple-300',
      {
        buryad: `Тэдэ ${conjugate(recipRoot).prs}.`,
        gloss: `they ${recipRoot}-PRS`,
        translation: `They ${baseMeaning} each other.`,
      }
    ),
    make(
      'Cooperative',
      'Хамтаршалай',
      coopRoot,
      v ? suf(h, '-лда', '-лдэ') : suf(h, '-алда', '-элдэ'),
      `Several subjects jointly "${baseMeaning}" (not directed at each other).`,
      'do together',
      'bg-pink-50 border-pink-300',
      {
        buryad: `Бидэ хамта ${conjugate(coopRoot).prs}.`,
        gloss: `we together ${coopRoot}-PRS`,
        translation: `We ${baseMeaning} together.`,
      }
    ),
  ];
}

// ─── Translation via Google Translate unofficial API (bxr = Buryat Russia) ─

export async function translateToBuryad(englishInput: string): Promise<string> {
  // Always use "to [verb]" form — forces Google Translate to return the infinitive
  const cleaned = englishInput.trim().replace(/^to\s+/i, '');
  const query = `to ${cleaned}`;
  const url =
    `https://translate.googleapis.com/translate_a/single?client=gtx` +
    `&sl=en&tl=bxr&dt=t&q=${encodeURIComponent(query)}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  // Shape: [[["translated text", "source text", ...], ...], null, "en", ...]
  const data = (await resp.json()) as [[[string, ...unknown[]], ...unknown[]], ...unknown[]];
  const raw = data[0][0][0];
  return raw.replace(/[;،.。\s]+$/, '').trim();
}
