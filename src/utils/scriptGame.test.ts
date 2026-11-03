import { describe, expect, it } from 'vitest';
import { SCRIPT_RULES } from '../data/scriptRules';
import { STROKE_PARTS } from '../data/scriptStrokes';
import { SCRIPT_WORDS } from '../data/scriptWords';
import { MVS, scriptWord, wordText } from './mongolScript';
import { grade, pickRound } from './scriptGame';

const marks = (target: string, answer: string) =>
  grade(target, answer)
    .marks.map(m => m.mark)
    .join(' ');

describe('grade', () => {
  it('gives 100% for the exact spelling, ASCII spellings included', () => {
    expect(grade('qalaγun', 'qalaγun').percent).toBe(100);
    expect(grade('qalaγun', 'qalaghun').percent).toBe(100);
  });

  it('accepts a letter with the same shape but flags it', () => {
    expect(grade('modun', 'mudon')).toEqual({
      percent: 100,
      marks: [
        { text: 'm', mark: 'right' },
        { text: 'o', mark: 'sameShape' },
        { text: 'd', mark: 'right' },
        { text: 'u', mark: 'sameShape' },
        { text: 'n', mark: 'right' },
      ],
    });
    expect(grade('tende', 'dende').percent).toBe(100);
  });

  it('scores by the share of letters right', () => {
    // The spoken form: ula for aγula loses two of five letters.
    expect(grade('aγula', 'ula').percent).toBe(60);
    expect(marks('aγula', 'ula')).toBe('missing missing right right right');
    expect(grade('qara', 'xara').percent).toBe(100); // x is accepted for q
    expect(grade('qara', 'kara').percent).toBe(75);
  });

  it('counts extra letters against the answer and never goes below 0', () => {
    expect(grade('bi', 'bii').percent).toBe(50);
    expect(marks('bi', 'bii')).toBe('right extra right');
    expect(grade('bi', 'qaγalγa').percent).toBe(0);
  });

  it('checks the separated final a', () => {
    expect(grade('baγ-a', 'baγ-a').percent).toBe(100);
    expect(marks('baγ-a', 'baγa')).toBe('right right right missing right');
  });

  it('gives 0 for an empty or unreadable answer', () => {
    expect(grade('usun', '').percent).toBe(0);
    expect(grade('usun', '123').percent).toBe(0);
  });
});

describe('the word list', () => {
  it('holds only words the script engine can write', () => {
    for (const { latin } of SCRIPT_WORDS) expect(scriptWord(latin), latin).not.toBeNull();
  });

  it('has no repeats', () => {
    expect(new Set(SCRIPT_WORDS.map(w => w.latin)).size).toBe(SCRIPT_WORDS.length);
  });
});

describe('pickRound', () => {
  it('picks distinct items', () => {
    const round = pickRound(SCRIPT_WORDS, 10);
    expect(round).toHaveLength(10);
    expect(new Set(round).size).toBe(10);
  });
});

describe('the joined-or-apart pairs', () => {
  const pairs = SCRIPT_RULES.flatMap(r => r.pairs ?? []);

  it('differ only by the vowel separator', () => {
    expect(pairs.length).toBeGreaterThan(0);
    for (const { apart, joined } of pairs) {
      const a = scriptWord(apart.latin);
      const j = scriptWord(joined.latin);
      if (!a || !j) throw new Error(`not transliteration: ${apart.latin}`);
      expect(wordText(a).replace(MVS, '')).toBe(wordText(j));
      expect(wordText(a)).toContain(MVS);
    }
  });
});

describe('the letter parts', () => {
  it('start every stroke with a move, which is where the pen dot goes', () => {
    for (const part of STROKE_PARTS)
      for (const d of part.strokes) expect(d, part.name).toMatch(/^M\d+(\.\d+)? \d+(\.\d+)? /);
  });
});
