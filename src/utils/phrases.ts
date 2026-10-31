// ─── Reader: which words of a sentence belong together ────────────────────
// A small set of rules, not a parser. They only choose what to translate as a unit, and teach
// no forms of their own: Хэлэжэ байһан үгэдэ, харюусалгатай байха хэрэгтэй.

import { lookup, verbInfinitives, type ReaderIndex, type Token } from './reader';

export interface Phrase {
  start: number; // token indices, both ends included
  end: number;
  text: string;
}

const PARTICIPLE = /(һан|һон|һэн|даг|дог|дэг)$/; // textbook pp. 60, 68
const CONVERB = /(жа|жо|жэ)$/;
const INFINITIVE = /х[аоэ]$/;
const ACCUSATIVE = /[ыий]е$/; // ахые, хүниие, намайе (textbook pp. 33–34)
const MODALS = new Set(['хэрэгтэй', 'хэрэггүй', 'ёһотой']); // the Modals page

// Runs of words with only spaces between them: a comma or full stop ends a run.
function clauses(tokens: Token[]): number[][] {
  const runs: number[][] = [[]];
  tokens.forEach((token, i) => {
    if (token.key) runs[runs.length - 1].push(i);
    else if (!/^\s+$/.test(token.text)) runs.push([]);
  });
  return runs.filter(run => run.length > 0);
}

function isVerbForm(key: string, shape: RegExp): boolean {
  return shape.test(key) && verbInfinitives(key).length > 0;
}

// The noun a participle describes follows it, and can't be a verb itself.
function canBeHead(key: string, index: ReaderIndex): boolean {
  const hits = lookup(key, index);
  if (hits.length > 0) return hits.every(l => l.category !== 'verb');
  return verbInfinitives(key).length === 0;
}

function findInClause(keys: string[], index: ReaderIndex): Array<[number, number]> {
  const found: Array<[number, number]> = [];
  let free = 0; // the first word no phrase has taken

  for (let i = 0; i < keys.length; i++) {
    let start = -1;
    let end = i;

    if (
      isVerbForm(keys[i], PARTICIPLE) &&
      i + 1 < keys.length &&
      canBeHead(keys[i + 1], index) &&
      !MODALS.has(keys[i + 1])
    ) {
      // [object] [converbs] participle noun: хэлые үзэжэ байһан хүн
      start = i;
      while (start > free && isVerbForm(keys[start - 1], CONVERB)) start--;
      if (start > free && ACCUSATIVE.test(keys[start - 1])) start--;
      end = i + 1;
    } else if (MODALS.has(keys[i]) && i > free && INFINITIVE.test(keys[i - 1])) {
      // [predicate] -ха modal: харюусалгатай байха хэрэгтэй, ябаха хэрэгтэй
      start = i - 1;
      if (keys[start] === 'байха' && start > free) start--;
    }

    if (start >= 0) {
      found.push([start, end]);
      free = end + 1;
      i = end;
    }
  }
  return found;
}

export function findPhrases(tokens: Token[], index: ReaderIndex): Phrase[] {
  return clauses(tokens).flatMap(run =>
    findInClause(
      run.map(i => tokens[i].key ?? ''),
      index
    ).map(([from, to]) => {
      const [start, end] = [run[from], run[to]];
      const text = tokens
        .slice(start, end + 1)
        .map(t => t.text)
        .join('');
      return { start, end, text };
    })
  );
}

// The sentence each token belongs to.
export function sentenceOf(tokens: Token[]): string[] {
  const sentences = new Array<string>(tokens.length).fill('');
  let start = 0;
  const close = (end: number) => {
    const text = tokens
      .slice(start, end)
      .map(t => t.text)
      .join('')
      .trim();
    sentences.fill(text, start, end);
    start = end;
  };
  tokens.forEach((token, i) => {
    if (!token.key && /[.!?…\n]/.test(token.text)) close(i + 1);
  });
  close(tokens.length);
  return sentences;
}
