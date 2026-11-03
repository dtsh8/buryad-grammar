import { describe, expect, it } from 'vitest';
import { SCRIPT_READING } from '../data/scriptReading';
import {
  MVS,
  NNBSP,
  cyrillicToLatin,
  scriptTokens,
  scriptWord,
  wordText,
  type Letter,
} from './mongolScript';

function word(latin: string) {
  const result = scriptWord(latin);
  if (!result) throw new Error(`not transliteration: ${latin}`);
  return result;
}

const text = (latin: string) => wordText(word(latin));

const letters = (latin: string): Letter[] =>
  word(latin).pieces.flatMap(p => ('letter' in p ? [p.letter] : []));

describe('scriptWord', () => {
  it('writes transliteration letter for letter', () => {
    // Wikipedia's slogan in the script: ᠴᠢᠯᠦᠭᠡᠲᠦ ᠪᠢᠴᠢᠭ
    expect(text('čilügetü')).toBe('ᠴᠢᠯᠦᠭᠡᠲᠦ');
    expect(text('bičig')).toBe('ᠪᠢᠴᠢᠭ');
    expect(text('mongγol')).toBe('ᠮᠣᠩᠭᠣᠯ');
  });

  it('accepts ASCII spellings', () => {
    expect(text('mongghol')).toBe(text('mongγol'));
    expect(text('bichig')).toBe(text('bičig'));
    expect(text('ungshiju')).toBe(text('ungšiǰu'));
  });

  it('writes Poppe’s non-syllabic ị as yi inside a word and i at its end (§ 92)', () => {
    expect(letters('güịn').map(l => l.sound)).toEqual(['g', 'ü', 'y', 'i', 'n']);
    expect(letters('amuị').map(l => l.sound)).toEqual(['a', 'm', 'u', 'i']);
  });

  it('separates suffixes with NNBSP and a final a/e with MVS (§§ 87–88)', () => {
    expect(text('kümün-ü')).toBe(`ᠬᠦᠮᠦᠨ${NNBSP}ᠦ`);
    expect(text('suruγ-a')).toBe(`ᠰᠤᠷᠤᠭ${MVS}ᠠ`);
  });

  it('gives each letter its position', () => {
    expect(letters('nom').map(l => l.position)).toEqual(['initial', 'medial', 'final']);
    expect(letters('bi').map(l => l.position)).toEqual(['initial', 'final']);
  });

  it('rejects text that is not transliteration', () => {
    expect(scriptWord('123')).toBeNull();
  });
});

describe('alsoReads (Poppe §§ 72–76, 98, 101)', () => {
  const at = (latin: string, i: number) => letters(latin)[i].alsoReads;

  it('o and u share every shape; ö and ü join them after the first syllable', () => {
    expect(at('nom', 1)).toEqual(['u']);
    expect(at('kümün', 1)).toEqual(['ö']);
    expect(at('kümün', 3)).toEqual(['o', 'u', 'ö']);
  });

  it('t and d share their initial and medial shapes, but not d before a consonant', () => {
    expect(at('tabun', 0)).toEqual(['d']);
    expect(at('ende', 2)).toEqual(['t']);
    expect(at('odqu', 1)).toEqual([]);
  });

  it('medial and final a, e and undotted n look alike', () => {
    expect(at('tabun', 1)).toEqual(['e', 'n']);
    expect(at('erdem', 3)).toEqual(['a', 'n']);
    expect(at('tabun', 4)).toEqual(['a', 'e']);
    expect(at('nasun', 0)).toEqual([]); // dotted before a vowel
  });

  it('initial y and ǰ, medial y and i, k and g share shapes', () => {
    expect(at('yeke', 0)).toEqual(['ǰ']);
    expect(at('sayin', 2)).toEqual(['i']);
    expect(at('ken', 0)).toEqual(['g']);
  });

  it('γ before a consonant looks like medial q; dotted before a vowel it is unique', () => {
    expect(at('baγši', 2)).toEqual(['q']);
    expect(at('šibaγun', 4)).toEqual([]);
  });
});

describe('scriptTokens', () => {
  it('turns punctuation into Mongolian marks', () => {
    const tokens = scriptTokens('ene morin sayin buị.');
    expect(tokens.at(-1)).toEqual({ text: '᠃' });
    expect(tokens.filter(t => 'word' in t)).toHaveLength(4);
  });

  it('can write every reading sentence', () => {
    for (const { latin } of SCRIPT_READING) {
      expect(scriptTokens(latin).every(t => 'word' in t || !/[a-zγšǰčöüị]/i.test(t.text))).toBe(
        true
      );
    }
  });
});

describe('cyrillicToLatin', () => {
  it('uses Poppe’s spellings for the words in the table', () => {
    expect(cyrillicToLatin('хүн')).toBe('kümün');
    expect(cyrillicToLatin('Һара')).toBe('sara');
  });

  it('otherwise converts by sound', () => {
    expect(cyrillicToLatin('гол')).toBe('γol');
    expect(cyrillicToLatin('нютаг')).toBe('niyutaγ');
    expect(cyrillicToLatin('Буряад')).toBe('buriyad');
    expect(cyrillicToLatin('һайн')).toBe('sayin');
    expect(cyrillicToLatin('дулаан')).toBe('dulaγan');
    expect(cyrillicToLatin('гэр хүн')).toBe('ger kümün');
  });
});
