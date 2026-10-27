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

function suf(harmony: Harmony, back: string, front: string): string {
  return harmony === 'back' ? back : front;
}

// Vowel absorption: drop the duplicate leading vowel when root ends in the
// same character as the suffix starts (яба + аад → ябаад, үлэ + ээд → үлээд).
function attach(root: string, suffix: string): string {
  if (suffix.length > 0 && root[root.length - 1] === suffix[0]) {
    return root + suffix.slice(1);
  }
  return root + suffix;
}

// Returns true when epenthetic г must be inserted before the seq. converb suffix.
// Two environments (Skribnik 2003):
//   • Long-vowel root endings (аа оо уу ии ээ өө үү): угаа → угаагаад
//   • Semivowel й (behaves like a long-vowel coda):   бай  → байгаад
function needsEpentheticG(root: string): boolean {
  if (root.endsWith('й')) return true;
  if (root.length >= 2) {
    const last = root[root.length - 1];
    const prev = root[root.length - 2];
    if (last === prev && /[аоуэөүи]/.test(last)) return true;
  }
  return false;
}

// Sequential converb — 3-way vowel harmony (Skribnik 2003: §3.1.2):
// back (а, о, у) → -аад   ALL back vowels use same suffix (o and u are back!)
// front unrounded (э) → -ээд
// front rounded (ө/ү) → -өөд
// һуу → һуугаад ✓  (y is back → uses -аад, not -оод)
// и / й / consonants are transparent — scan left past them.
function seqConvSuffix(root: string): string {
  for (let i = root.length - 1; i >= 0; i--) {
    const c = root[i];
    if (BACK_VOWELS.test(c)) return 'аад'; // а, о, у → back
    if (c === 'э') return 'ээд'; // front unrounded
    if (FRONT_VOWELS.test(c)) return 'өөд'; // front rounded
    // и / й / consonants — keep scanning
  }
  return 'аад'; // default
}

export function conjugate(root: string) {
  const h = detectHarmony(root);
  const suffix = seqConvSuffix(root);
  // Long-vowel / й endings need epenthetic г (no absorption — г is a consonant).
  // Short-vowel endings use attach() for vowel absorption.
  const seqConv = needsEpentheticG(root) ? root + 'г' + suffix : attach(root, suffix);
  return {
    inf: root + suf(h, 'ха', 'хэ'),
    prs: root + suf(h, 'на', 'нэ'),
    pst: root + suf(h, 'ба', 'бэ'),
    evidPst: root + suf(h, 'лай', 'лэй'),
    hab: root + suf(h, 'даг', 'дэг'),
    neg: root + suf(h, 'дагүй', 'дэгүй'),
    simConv: root + suf(h, 'жа', 'жэ'),
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

  // Causative: vowel-initial suffix уул/үүл — epenthetic г required for
  // long-vowel/й roots to avoid illegal vowel clusters (угаа+уул → угаагуул).
  const causRoot = needsG ? baseRoot + 'г' + suf(h, 'уул', 'үүл') : baseRoot + suf(h, 'уул', 'үүл');
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
      suf(h, '-уул', '-үүл'),
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
