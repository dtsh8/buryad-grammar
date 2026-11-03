import { scriptWord, type Letter } from './mongolScript';

// Grading for the Script page's spelling game. The answer is compared letter by letter with the
// written form; a letter that the script draws with the same shape in that place (o for u, t for
// d …) gives the same word on paper, so it counts as right and is only flagged.

export type Mark = 'right' | 'sameShape' | 'wrong' | 'missing' | 'extra';

export interface MarkedUnit {
  text: string; // a transliteration letter, or "-" for a suffix or vowel written apart
  mark: Mark;
}

export interface Grade {
  percent: number;
  marks: MarkedUnit[];
}

interface Unit {
  text: string;
  letter?: Letter;
}

function units(latin: string): Unit[] | null {
  const word = scriptWord(latin.trim().replace(/\s+/g, ''));
  return word
    ? word.pieces.map(p =>
        'letter' in p ? { text: p.letter.sound, letter: p.letter } : { text: '-' }
      )
    : null;
}

function sameShape(target: Unit, answer: Unit): boolean {
  return target.letter?.alsoReads.includes(answer.text as Letter['sound']) ?? false;
}

export function grade(target: string, answer: string): Grade {
  const t = units(target) ?? [];
  const a = units(answer) ?? [];
  const cost = (i: number, j: number) => (t[i].text === a[j].text || sameShape(t[i], a[j]) ? 0 : 1);

  // Edit distance, keeping the table to walk back through.
  const d = Array.from({ length: t.length + 1 }, (_, i) =>
    Array.from({ length: a.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= t.length; i++)
    for (let j = 1; j <= a.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost(i - 1, j - 1));

  const marks: MarkedUnit[] = [];
  let i = t.length;
  let j = a.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + cost(i - 1, j - 1)) {
      const mark: Mark =
        t[i - 1].text === a[j - 1].text
          ? 'right'
          : sameShape(t[i - 1], a[j - 1])
            ? 'sameShape'
            : 'wrong';
      marks.push({ text: t[i - 1].text, mark });
      i--;
      j--;
    } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) {
      marks.push({ text: t[i - 1].text, mark: 'missing' });
      i--;
    } else {
      marks.push({ text: a[j - 1].text, mark: 'extra' });
      j--;
    }
  }
  marks.reverse();

  const percent = t.length
    ? Math.round((100 * Math.max(0, t.length - d[t.length][a.length])) / t.length)
    : 0;
  return { percent, marks };
}

// A round of `size` distinct items in random order.
export function pickRound<T>(items: readonly T[], size: number, random = Math.random): T[] {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const k = Math.floor(random() * (i + 1));
    [pool[i], pool[k]] = [pool[k], pool[i]];
  }
  return pool.slice(0, size);
}
