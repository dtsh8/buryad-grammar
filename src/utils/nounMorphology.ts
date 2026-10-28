// ─── Buryad Noun Declension Engine ────────────────────────────────────────
// Singular case forms by rule. Sources: Учебник бурятского языка pp. 31 (genitive), 33–34
// (accusative), 36 (instrumental), 39 (dative), 41 (ablative), 44 (comitative) and the summary
// table on p. 46; every rule below was checked against the Buryat National Corpus
// (docs/verification-questions.md).
//
// Stems ending in н need one lexical fact, which the spelling doesn't show:
//   stable    н stays everywhere:            хүн → хүнэй, хүндэ, хүниие, хүнөөр, хүнтэй, хүнһөө
//   unstable  н drops in acc / ins / com:     морин → мориной, мориндо, мориие, морёор, моритой,
//                                            моринһоо   (BNC: мориие 49, морёор 170, моритой 339)
//   velar     back н (ŋ) takes г:            ан → ангай, анда, ангые, ангаар, антай, ангһаа

import {
  IOTATED_LONG,
  endsInShortI,
  getSufClass,
  longVowelClass,
  needsEpentheticG,
  sufC,
} from './verbMorphology';

export type NStem = 'stable' | 'unstable' | 'velar';

export type CaseId =
  'nominative' | 'genitive' | 'dative' | 'accusative' | 'instrumental' | 'comitative' | 'ablative';

export type Declension = Record<CaseId, string>;

const VOWEL = /[аоуэөүиыяеёю]/;

// Dative -да after vowels, л м н ж з and consonant clusters; -та after other consonants
// (textbook p. 39: ажалда, номдо, гэртэ, класста, театрта).
function dativeT(word: string): boolean {
  const last = word.at(-1) ?? '';
  if (VOWEL.test(last) || /[лмнжзйь]/.test(last)) return false;
  const prev = word.at(-2) ?? '';
  // A cluster of two different consonants takes -да, except a final р (театрта).
  const cluster = !VOWEL.test(prev) && prev !== last && prev !== 'й';
  return !(cluster && last !== 'р');
}

// Declines a single word (lower-cased for analysis; suffixes are appended to the original).
function declineWord(word: string, nStem: NStem | undefined): Declension {
  const w = word.toLowerCase();
  const cls = getSufClass(w);
  const long = longVowelClass(w);
  const short = (a: string, o: string, e: string) => sufC(cls, a, o, e);
  const dat = dativeT(w) ? short('та', 'то', 'тэ') : short('да', 'до', 'дэ');
  const com = short('тай', 'той', 'тэй');
  const abl = 'һ' + long;

  // Forms built on a vowel-final stem (also unstable н after it drops).
  const vowelStem = (s: string) => {
    const sl = s.toLowerCase();
    const l = longVowelClass(sl);
    const c = getSufClass(sl);
    if (needsEpentheticG(sl)) {
      // long vowel or diphthong: шанаае, бороогоор
      return { acc: s + 'е', ins: s + 'г' + l + 'р', com: s + sufC(c, 'тай', 'той', 'тэй') };
    }
    if (endsInShortI(sl)) {
      // short и: ханиие, һургууляар, морёор
      return {
        acc: s + 'ие',
        ins: s.slice(0, -1) + IOTATED_LONG[l] + 'р',
        com: s + sufC(c, 'тай', 'той', 'тэй'),
      };
    }
    // short vowel drops before -ые / -аар: ахые, ахаар
    return {
      acc: s.slice(0, -1) + 'ые',
      ins: s.slice(0, -1) + l + 'р',
      com: s + sufC(c, 'тай', 'той', 'тэй'),
    };
  };

  if (w.endsWith('н') && nStem === 'velar') {
    return {
      nominative: word,
      genitive: word + 'г' + short('ай', 'ой', 'эй'),
      dative: word + dat,
      accusative: word + 'гые',
      instrumental: word + 'г' + long + 'р',
      comitative: word + com,
      ablative: word + 'г' + abl,
    };
  }

  if (w.endsWith('н') && nStem === 'unstable') {
    const v = vowelStem(word.slice(0, -1));
    return {
      nominative: word,
      genitive: word + short('ай', 'ой', 'эй'), // мориной, модоной
      dative: word + dat, // мориндо
      accusative: v.acc, // мориие, модые, шулууе
      instrumental: v.ins, // морёор, модоор, шулуугаар
      comitative: v.com, // моритой, мүнгэтэй
      ablative: word + abl, // моринһоо
    };
  }

  const last = w.at(-1) ?? '';
  if (!VOWEL.test(last) && last !== 'й') {
    // consonant (including stable н): гэрэй, гэртэ, гэрые, гэрээр, гэртэй, гэрһээ; хүниие
    return {
      nominative: word,
      genitive: word + short('ай', 'ой', 'эй'),
      dative: word + dat,
      accusative: word + (last === 'н' ? 'иие' : 'ые'),
      instrumental: word + long + 'р',
      comitative: word + com,
      ablative: word + abl,
    };
  }

  const v = vowelStem(word);
  const diphthong = last === 'й' || last === 'ы';
  const genitive = diphthong
    ? word + 'н' // нохойн, баабайн
    : needsEpentheticG(w)
      ? word + 'г' + short('ай', 'ой', 'эй') // будаагай
      : endsInShortI(w)
        ? word + 'ин' // ханиин
        : word.slice(0, -1) + 'ын'; // эхын, хадын
  return {
    nominative: word,
    genitive,
    dative: word + dat,
    accusative: v.acc,
    instrumental: v.ins,
    comitative: v.com,
    ablative: word + abl,
  };
}

// Declines a noun or a noun phrase; only the last word takes the case (галта тэргэ → галта тэргээр).
export function decline(noun: string, nStem?: NStem): Declension {
  const cut = noun.lastIndexOf(' ') + 1;
  const head = noun.slice(0, cut);
  const forms = declineWord(noun.slice(cut), nStem);
  return Object.fromEntries(Object.entries(forms).map(([k, f]) => [k, head + f])) as Declension;
}
