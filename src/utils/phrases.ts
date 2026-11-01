// ─── Reader: which words of a sentence belong together ────────────────────
// A small set of rules, not a parser. They choose what to translate as a unit, teach no forms of
// their own, and say how a participle relates to the words around it: Хэлэжэ байһан үгэдэ,
// харюусалгатай байха хэрэгтэй.

import { decline, type CaseId } from './nounMorphology';
import { lookup, verbInfinitives, wordKey, type ReaderIndex, type Token } from './reader';

// What the word before a participle says about the noun after it. A noun can be the participle's
// doer (ерэһэн багша, textbook p. 68; Германиhаа ерэhэн хүн, K&K p. 69) or its object (олоогүй
// талхан, textbook p. 50; хэхэ ажал, K&K p. 116), and nothing on the noun itself shows which.
export type TieKind = 'object' | 'bareObject' | 'doer' | 'open';

export interface ParticipleTie {
  kind: TieKind;
  partner?: string; // the object or doer, unless the kind is open
  participle: string; // with its converbs: үзэжэ байһан
  noun: string;
  nounCase?: CaseId; // when the vocabulary knows the noun
}

export interface Phrase {
  start: number; // token indices, both ends included
  end: number;
  text: string;
  tie?: ParticipleTie;
}

const PARTICIPLE = /(һан|һон|һэн|даг|дог|дэг)$/; // textbook pp. 60, 68
const CONVERB = /(жа|жо|жэ)$/;
const INFINITIVE = /х[аоэ]$/;
const ACCUSATIVE = /[ыий]е$/; // ахые, хүниие, намайе (textbook pp. 33–34)
const MODALS = new Set(['хэрэгтэй', 'хэрэггүй', 'ёһотой']); // the Modals page
// Unknown genitives, as names often are: Доржын. Most -тай words are comitative or adjectives.
const GENITIVE = /(ын|[аоэ]й)$/; // textbook p. 31
const NOT_GENITIVE = /(т[аоэ]й|гүй)$/;
const GENITIVE_PRONOUNS = new Set([
  'минии',
  'шинии',
  'манай',
  'танай',
  'таны',
  'тэрэнэй',
  'бидэнэй',
]);
// Words that follow a participle and aren't nouns. BNC, the words after 522 participles in
// sentences sampled from хэлэһэн, уншаһан, ерэһэн, бэшэһэн, хэлэдэг; юм textbook p. 68, һаа, хада p. 71.
const NOT_HEADS = new Set([
  'юм',
  'һэн',
  'һаа',
  'аад',
  'хада',
  'хадаа',
  'гээшэ',
  'хүм',
  'бэшэ',
  'шэнгеэр',
  'мэтэ',
  'хэбэртэй',
  'хойно',
  'хойноо',
  'дээрэһээ',
  'соонь',
  'руу',
]);
const HEAD_CATEGORIES = new Set(['noun', 'pronoun', 'numeral']);

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
  if (NOT_HEADS.has(key)) return false;
  const hits = lookup(key, index);
  if (hits.length > 0) return hits.some(l => HEAD_CATEGORIES.has(l.category));
  return verbInfinitives(key).length === 0;
}

function caseOf(key: string, index: ReaderIndex): CaseId | undefined {
  for (const l of lookup(key, index)) {
    if (l.category !== 'noun') continue;
    const forms = Object.entries(decline(l.buryad, l.nStem));
    const form = forms.find(([, f]) => wordKey(f) === key);
    if (form) return form[0] as CaseId;
  }
  return undefined;
}

function partnerKind(key: string, index: ReaderIndex): Exclude<TieKind, 'open'> | null {
  if (ACCUSATIVE.test(key)) return 'object';
  if (GENITIVE_PRONOUNS.has(key)) return 'doer';
  const hits = lookup(key, index);
  const form = caseOf(key, index);
  if (form === 'genitive') return 'doer';
  if (form === 'nominative') {
    // Words for people always take the accusative ending (textbook p. 34); others may not.
    const person = hits.some(l => l.tags?.some(tag => tag === 'person' || tag === 'family'));
    return person ? null : 'bareObject';
  }
  const unknown = hits.length === 0 && verbInfinitives(key).length === 0;
  return unknown && GENITIVE.test(key) && !NOT_GENITIVE.test(key) ? 'doer' : null;
}

interface Match {
  from: number;
  to: number;
  participle?: number; // where the participle starts, with its converbs
  kind?: TieKind;
}

function findInClause(keys: string[], index: ReaderIndex): Match[] {
  const found: Match[] = [];
  let free = 0; // the first word no phrase has taken

  for (let i = 0; i < keys.length; i++) {
    let start = -1;
    let end = i;
    let participle: number | undefined;
    let kind: TieKind | undefined;

    if (
      isVerbForm(keys[i], PARTICIPLE) &&
      i + 1 < keys.length &&
      canBeHead(keys[i + 1], index) &&
      !MODALS.has(keys[i + 1])
    ) {
      // [object or doer] [converbs] participle noun: хэлые үзэжэ байһан хүн, минии хэлэһэн үгэ
      start = i;
      while (start > free && isVerbForm(keys[start - 1], CONVERB)) start--;
      participle = start;
      kind = 'open';
      const partner = start > free ? partnerKind(keys[start - 1], index) : null;
      if (partner) {
        kind = partner;
        start--;
      }
      end = i + 1;
    } else if (MODALS.has(keys[i]) && i > free && INFINITIVE.test(keys[i - 1])) {
      // [predicate] -ха modal: харюусалгатай байха хэрэгтэй, ябаха хэрэгтэй
      start = i - 1;
      if (keys[start] === 'байха' && start > free) start--;
    }

    if (start >= 0) {
      found.push({ from: start, to: end, participle, kind });
      free = end + 1;
      i = end;
    }
  }
  return found;
}

export function findPhrases(tokens: Token[], index: ReaderIndex): Phrase[] {
  const between = (start: number, end: number) =>
    tokens
      .slice(start, end + 1)
      .map(t => t.text)
      .join('');

  return clauses(tokens).flatMap(run =>
    findInClause(
      run.map(i => tokens[i].key ?? ''),
      index
    ).map(({ from, to, participle, kind }) => {
      const [start, end] = [run[from], run[to]];
      const phrase: Phrase = { start, end, text: between(start, end) };
      if (kind && participle !== undefined) {
        phrase.tie = {
          kind,
          partner: kind === 'open' ? undefined : tokens[start].text,
          participle: between(run[participle], run[to - 1]),
          noun: tokens[end].text,
          nounCase: caseOf(tokens[end].key ?? '', index),
        };
      }
      return phrase;
    })
  );
}

// Sentences end at . ! ? … or a line break. Stretches with no words in them are left out.
export function splitSentences(tokens: Token[]): Phrase[] {
  const sentences: Phrase[] = [];
  let start = 0;
  const close = (end: number) => {
    const part = tokens.slice(start, end + 1);
    if (part.some(t => t.key)) {
      const text = part
        .map(t => t.text)
        .join('')
        .trim();
      sentences.push({ start, end, text });
    }
    start = end + 1;
  };
  tokens.forEach((token, i) => {
    if (!token.key && /[.!?…\n]/.test(token.text)) close(i);
  });
  close(tokens.length - 1);
  return sentences;
}
