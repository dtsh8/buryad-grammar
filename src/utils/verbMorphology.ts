// ─── Buryad Verb Morphology Engine ────────────────────────────────────────
// Sources: Skribnik (2003) Buryat · Poppe (1960) Buriat Grammar

import { englishForms } from './englishForms.ts';

export type Harmony = 'back' | 'front';

const BACK_VOWELS = /[аоу]/;
const FRONT_VOWELS = /[эөү]/;

// Iotated letters spell й + vowel; ы is a variant of и after hard consonants.
// Harmony and absorption care only about the vowel, so normalise them here.
const IOTATED: Record<string, string> = { я: 'а', е: 'э', ё: 'о', ю: 'у', ы: 'и' };

// The vowel a letter represents, or null for consonants (incl. й).
function vowelOf(c: string): string | null {
  if (/[аоуэөүи]/.test(c)) return c;
  return IOTATED[c] ?? null;
}

// The vowel at position i for harmony purposes. Buryad writes ю for й + у in back words and
// й + ү in front ones, and юу is the long vowel (эдюул-, барюул-), so the word decides:
// нюдэн → нюдөөр (ү rounds), эдюулхэ but барюулха (Buryat National Corpus).
function harmonyVowelAt(root: string, i: number): string | null {
  if (root[i] === 'ю' || (root[i] === 'у' && root[i - 1] === 'ю')) {
    return /[эөүе]/.test(root) ? 'ү' : 'у';
  }
  return vowelOf(root[i]);
}

export function detectHarmony(root: string): Harmony {
  for (let i = root.length - 1; i >= 0; i--) {
    const v = harmonyVowelAt(root, i) ?? '';
    if (BACK_VOWELS.test(v)) return 'back';
    if (FRONT_VOWELS.test(v)) return 'front';
  }
  return 'back';
}

export function endsInVowel(root: string): boolean {
  return vowelOf(root[root.length - 1] ?? '') !== null;
}

// Strip infinitive suffix -ха / -хэ / -хо to get root
export function extractRoot(infinitive: string): string {
  return infinitive.replace(/[;،.。\s]+$/, '').replace(/хо$|ха$|хэ$/, '');
}

// ─── Suffix helpers ────────────────────────────────────────────────────────
// Buryad verbal suffixes are 3-way harmonic based on the last significant vowel:
//   а-class (а, у roots) → а-variants: -ха -на -ба -һан -даг -жа
//   о-class (о roots)       → о-variants: -хо -но -бо -һон -дог -жо   (орохо, ороно etc.)
//   э-class (э, ө, ү roots) → э-variants: -хэ -нэ -бэ -һэн -дэг -жэ
//
// Long suffix vowels (-аад, -аар, …) are a separate 4-way system (see longVowelClass).

// SufClass: which suffix vowel template to use
export type SufClass = 'а' | 'о' | 'э';

// Scan RTL past transparent sounds to find the last significant vowel,
// then map to a suffix class:
//   у → а-class (у is back but uses а-variants, confirmed: һуу → һуугаад)
//   о → о-class (confirmed: оро → ороно, оробо, etc.)
//   э/ө/ү → э-class
export function getSufClass(root: string): SufClass {
  for (let i = root.length - 1; i >= 0; i--) {
    const c = harmonyVowelAt(root, i);
    if (c === 'а' || c === 'у') return 'а'; // back unrounded + high back rounded
    if (c === 'о') return 'о'; // back rounded mid
    if (c && FRONT_VOWELS.test(c)) return 'э'; // any front vowel
    // и, й, consonants are transparent
  }
  return 'а'; // default
}

// Pick the correct suffix variant for this class.
export function sufC(cls: SufClass, а: string, о: string, э: string): string {
  if (cls === 'о') return о;
  if (cls === 'э') return э;
  return а;
}

// Keep 2-way suf() for back/front derivational suffix selection in deriveAll.
function suf(harmony: Harmony, back: string, front: string): string {
  return harmony === 'back' ? back : front;
}

// Vowel absorption: a short stem-final vowel is replaced by a vowel-initial suffix
// (яба + аад → ябаад, оро + оод → ороод, үзэ + өөд → үзөөд).
// Iotated finals keep their й, so the suffix's first vowel is dropped instead
// (уя + аад → уяад since я = й + а).
// Callers handle long-vowel and й finals separately (epenthetic г).
function attach(root: string, suffix: string): string {
  const last = root[root.length - 1] ?? '';
  const lastVowel = vowelOf(last);
  if (lastVowel === null || vowelOf(suffix[0] ?? '') === null) return root + suffix;
  if (last in IOTATED) {
    return lastVowel === suffix[0] ? root + suffix.slice(1) : root + suffix;
  }
  return root.slice(0, -1) + suffix;
}

// Returns true when epenthetic г must be inserted before the suffix.
// Two environments (Skribnik 2003):
//   • Long-vowel endings (аа оо уу ии ээ өө үү, also еэ яа): угаа → угаагаад, түлеэ → түлеэгээд
//   • Semivowel й:                                   бай  → байгаад
export function needsEpentheticG(root: string): boolean {
  if (root.endsWith('й')) return true;
  if (root.length >= 2) {
    const last = root[root.length - 1];
    const prev = vowelOf(root[root.length - 2]);
    if (!(last in IOTATED) && prev !== null && prev === vowelOf(last)) return true;
  }
  return false;
}

// Long suffix vowels — 4-way harmony with Buryad labial attraction (Poppe 1960),
// refined against the burunen.ru corpus (docs/verification-questions.md, B3):
//   а / у                  → аа   ябаад, уншаад, һуугаад
//   о                      → оо   ороод
//   ө (short or long)      → өө   хөөрэлдөөд
//   short ү, 1st syllable  → өө   үзөөд, үгөөд, хүрөөд  (Buryad rounds after ү, unlike Khalkha)
//   long үү, 1st syllable  → ээ   дүүргээд
//   ү, later syllable      → ээ   үзүүлээд      (as non-initial уу blocks: оруулаад)
//   long ээ, later syllable→ ээ   бүтээгээд     (blocks rounding from ү)
//   short э                → transparent; ээ if nothing else decides: ерээд, мэдээд
// Scanned right-to-left by syllable nucleus; и and consonants are transparent.
export type LongVowel = 'аа' | 'оо' | 'ээ' | 'өө';

export function longVowelClass(root: string): LongVowel {
  // Nuclei: runs of identical vowel letters count as one long vowel,
  // except a following я/е, which starts a new syllable (й + vowel).
  const nuclei: Array<{ v: string; long: boolean }> = [];
  let prev: string | null = null; // vowel of the previous letter, null after a consonant
  for (let i = 0; i < root.length; i++) {
    const ch = root[i];
    const v = harmonyVowelAt(root, i);
    if (v !== null && v === prev && ch !== 'я' && ch !== 'е') {
      nuclei[nuclei.length - 1].long = true;
    } else if (v !== null) {
      nuclei.push({ v, long: false });
    }
    prev = v;
  }
  let sawFront = false;
  for (let i = nuclei.length - 1; i >= 0; i--) {
    const { v, long } = nuclei[i];
    if (v === 'а' || v === 'у') return 'аа';
    if (v === 'о') return 'оо';
    if (v === 'ө') return 'өө';
    if (v === 'ү') return i === 0 && !long ? 'өө' : 'ээ';
    if (v === 'э' && long && i > 0) return 'ээ';
    if (v === 'э') sawFront = true;
  }
  return sawFront ? 'ээ' : 'аа';
}

// A stem-final short и fuses with a long suffix vowel into an iotated letter:
//   бари + аад → баряад, таби + аа → табяа, боли + оод → болёод, эди + ээд → эдеэд
// Front stems always get еэ, even after ү (үрди → үрдеэд; Skribnik & Darzhaeva 2020).
// Short suffixes attach unchanged: бариха, барижа, эдихэ, эдидэг (burunen.ru corpus).
export const IOTATED_LONG: Record<LongVowel, string> = { аа: 'яа', оо: 'ёо', ээ: 'еэ', өө: 'еэ' };

export function endsInShortI(root: string): boolean {
  return root.endsWith('и') && !root.endsWith('ии');
}

// Root + long-vowel-initial suffix (-аа, -аад, …), with epenthetic г after
// long vowels and й (угаагаад, байгаа) and absorption otherwise (ябаад, үзөөд).
function attachLong(root: string, rest: string): string {
  const cls = longVowelClass(root);
  if (endsInShortI(root)) return root.slice(0, -1) + IOTATED_LONG[cls] + rest;
  const suffix = cls + rest;
  return needsEpentheticG(root) ? root + 'г' + suffix : attach(root, suffix);
}

export interface Conjugation {
  inf: string;
  prs: string;
  pst: string;
  perf: string;
  pstPtcp: string;
  hab: string;
  neg: string;
  negPst: string;
  simConv: string;
  seqConv: string;
  jussive: string;
  res: string;
}

export function conjugate(root: string): Conjugation {
  const cls = getSufClass(root);
  // Jussive / permissive mood: suffix -г
  // Expresses "Let him/her/you do X" (Пусть…) — 2nd or 3rd person.
  // Гэртээ байг! = "Let him stay home!" / "Just stay home!" (context-dependent)
  // Vowel-final and й-final roots: root + г  (яба→ябаг, бай→байг, оро→орог)
  // Consonant-final roots: root + аг/ог/эг   (хүдэл→хүдэлэг, бол→болог)
  const jussive =
    endsInVowel(root) || root.endsWith('й') ? root + 'г' : root + sufC(cls, 'аг', 'ог', 'эг');

  // Perfect -аа (ябаа, хүдэлөө): the most frequent past form in the corpus.
  const perf = attachLong(root, '');

  // Resultative participle -нхай "has done, result in place" (textbook p. 67: ерэнхэй, ошонхой).
  // Consonant-final roots insert the class vowel, as in the jussive (corpus: болонхой);
  // й-final roots attach directly (corpus: байнхай).
  const resSuffix = sufC(cls, 'нхай', 'нхой', 'нхэй');
  const res = endsInVowel(root) || root.endsWith('й') ? root + resSuffix : root + cls + resSuffix;

  return {
    inf: root + sufC(cls, 'ха', 'хо', 'хэ'),
    prs: root + sufC(cls, 'на', 'но', 'нэ'),
    pst: root + sufC(cls, 'ба', 'бо', 'бэ'),
    perf,
    pstPtcp: root + sufC(cls, 'һан', 'һон', 'һэн'),
    hab: root + sufC(cls, 'даг', 'дог', 'дэг'),
    // Habitual + -гүй keeps both г: ябадаггүй (corpus: 26×, never *ябадагүй)
    neg: root + sufC(cls, 'даггүй', 'доггүй', 'дэггүй'),
    negPst: perf + 'гүй',
    simConv: root + sufC(cls, 'жа', 'жо', 'жэ'),
    seqConv: attachLong(root, 'д'),
    jussive,
    res,
  };
}

// Stems that take the passive -да/-та instead of -гда (textbook p. 84):
// -да after л + vowel (оло → олдохо), -та after р, г, б + short vowel (аба → абтаха).
// The textbook's own хара → харагдаха and бари → баригдаха show this is not a general
// rule, so only the cited stems are listed (corpus: абтаа, үгтэнэ, олдоно).
const PASSIVE_STEMS: Record<string, string> = { аба: 'абта', үгэ: 'үгтэ', оло: 'олдо' };

// Causatives that don't use -уул/-үүл (Buryat National Corpus): гаргаха 284, болгохо 300,
// зогсоохо 14, бодхоохо 29; the regular forms гаруулха, болуулха, зогсуулха, бодуулха are 0.
const CAUSATIVE_STEMS: Record<string, string> = {
  гара: 'гарга',
  боло: 'болго',
  зогсо: 'зогсоо',
  бодо: 'бодхоо',
};

// ─── Derivation rules ──────────────────────────────────────────────────────

export interface DerivedForm extends Conjugation {
  label: string;
  buryad: string;
  suffix: string;
  description: string;
  englishRole: string;
  root: string;
  exampleSentence: { buryad: string; gloss: string; translation: string };
  color: string;
}

export function deriveAll(baseRoot: string, baseMeaning: string): DerivedForm[] {
  const h = detectHarmony(baseRoot);
  const cls = getSufClass(baseRoot);
  // й behaves like a vowel before consonant-initial suffixes (гүй → гүйлдэхэ, BNC 29).
  const v = endsInVowel(baseRoot) || baseRoot.endsWith('й');
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

  // Causative (Buryat National Corpus counts in brackets):
  //   • listed stems take -га/-го/-оо (CAUSATIVE_STEMS: гарга-, болго-, зогсоо-, бодхоо-)
  //   • short и: и + үүл → юул         эди → эдюул (33), бари → барюул (43)
  //   • long vowel or й: -лга/-лго/-лгэ  һуу → һуулга (38), уу → уулга (16),
  //                                      угаа → угаалга (3), бай → байлга (68), гүй → гүйлгэ (14)
  //   • other short vowel: drop it + уул/үүл   яба → ябуул (241), оро → оруул (204)
  //   • consonant final: + уул/үүл            хүдэл → хүдэлүүл
  const causVoiceSuffix = suf(h, 'уул', 'үүл');
  const causRoot =
    CAUSATIVE_STEMS[baseRoot] ??
    (endsInShortI(baseRoot)
      ? baseRoot.slice(0, -1) + 'юул'
      : needsG
        ? baseRoot + sufC(cls, 'лга', 'лго', 'лгэ')
        : endsInVowel(baseRoot)
          ? baseRoot.slice(0, -1) + causVoiceSuffix
          : baseRoot + causVoiceSuffix);
  // Shown suffix: what follows the part shared with the base root (гара → гар|га).
  let shared = 0;
  while (shared < baseRoot.length && causRoot[shared] === baseRoot[shared]) shared++;
  const causSuffix = (shared === baseRoot.length ? '+' : '-') + causRoot.slice(shared);
  // The remaining suffixes have short non-high vowels, so they follow the
  // same 3-way а/о/э class as inflection (оро → орогдо, not *орогда).
  // Passive: г-initial suffix гда/гдэ already provides the buffer consonant;
  // a few stems take -да/-та instead (PASSIVE_STEMS).
  const passRoot =
    PASSIVE_STEMS[baseRoot] ??
    baseRoot + (v ? sufC(cls, 'гда', 'гдо', 'гдэ') : sufC(cls, 'агда', 'огдо', 'эгдэ'));
  const passSuffix = passRoot.slice(passRoot.startsWith(baseRoot) ? baseRoot.length : -2);
  // Reciprocal -лда and cooperative -лса: the textbook's "взаимно-совместный залог" (p. 86).
  // -лда: two parties act on each other (барилдаха 'wrestle', хөөрэлдэхэ 'talk together');
  // -лса: joining someone in an action (ошолсохо 'go along with', таиралсаха 'help saw').
  const recipSuffix = v ? sufC(cls, 'лда', 'лдо', 'лдэ') : sufC(cls, 'алда', 'олдо', 'элдэ');
  const coopSuffix = v ? sufC(cls, 'лса', 'лсо', 'лсэ') : sufC(cls, 'алса', 'олсо', 'элсэ');
  const recipRoot = baseRoot + recipSuffix;
  const coopRoot = baseRoot + coopSuffix;

  // Pre-compute correct English forms once — shared across all 4 example sentences
  const ef = englishForms(baseMeaning);

  return [
    make(
      'Causative',
      'Үйлдүүлэгшэ',
      causRoot,
      causSuffix,
      `Cause or allow someone else to "${baseMeaning}".`,
      'make / let someone do',
      'bg-amber-50 border-amber-300',
      {
        buryad: `Би тэрэниие ${conjugate(causRoot).prs}б.`,
        gloss: `I him.ACC ${causRoot}-PRS-1SG`,
        translation: `I make him ${baseMeaning}.`,
      }
    ),
    make(
      'Passive',
      'Эдлүүлэгшэ',
      passRoot,
      '-' + passSuffix,
      `Subject undergoes "${baseMeaning}" — agent demoted or absent.`,
      'be done (to)',
      'bg-mongol-50 border-mongol-300',
      {
        buryad: `Энэ ${conjugate(passRoot).prs}.`,
        gloss: `this ${passRoot}-PRS`,
        // Use past participle, not naive base+ed
        translation: `This is (being) ${ef.pastPart}.`,
      }
    ),
    make(
      'Reciprocal',
      'Хэлсэлэй',
      recipRoot,
      '-' + recipSuffix,
      `Two parties "${baseMeaning}" each other, or do it jointly as partners.`,
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
      '-' + coopSuffix,
      `Someone joins another person in the action "${baseMeaning}" (not directed at each other).`,
      'do together',
      'bg-pink-50 border-pink-300',
      {
        buryad: `Бидэ хамта ${conjugate(coopRoot).prs}бди.`,
        gloss: `we together ${coopRoot}-PRS-1PL`,
        translation: `We ${baseMeaning} together.`,
      }
    ),
  ];
}

// ─── Translation via Google Translate unofficial API (bxr = Buryat Russia) ─

export async function translateToBuryad(englishInput: string): Promise<string> {
  // Always use "to [verb]" form — forces Google Translate to return the infinitive
  const cleaned = englishInput.trim().replace(/^to\s+/i, '');
  return googleTranslate('en', 'bxr', `to ${cleaned}`);
}

// Buryad to English or Russian, for words the curated vocabulary doesn't have.
export function translateFromBuryad(word: string, target: 'en' | 'ru'): Promise<string> {
  return googleTranslate('bxr', target, word);
}

// Russian to English, for glosses from the Russian-only Burlang dictionary.
export function translateRussian(text: string): Promise<string> {
  return googleTranslate('ru', 'en', text);
}

async function googleTranslate(from: string, to: string, query: string): Promise<string> {
  const url =
    `https://translate.googleapis.com/translate_a/single?client=gtx` +
    `&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(query)}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  // Shape: [[["translated text", "source text", ...], ...], null, "en", ...]
  const data = (await resp.json()) as [[[string, ...unknown[]], ...unknown[]], ...unknown[]];
  const raw = data[0][0][0];
  return raw.replace(/[;،.。\s]+$/, '').trim();
}
