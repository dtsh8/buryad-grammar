#!/usr/bin/env node
// ─── corpus_search.ts ─────────────────────────────────────────────────────
// Counts word forms in the local corpus, for checking grammar claims.
// Each argument is a pattern matched against whole lower-cased words.
//
//   npm run corpus:search -- эдихэ эдеэхэ           exact forms
//   npm run corpus:search -- ".+нхай" --ctx 2      all forms ending in -нхай, 2 contexts each
//   npm run corpus:search -- ".+(даг|дэг)гүй" --top 30
//
// Options: --top N (forms listed per pattern, default 20), --ctx N (contexts shown
// for each of the top 5 forms, default 0).

import * as fs from 'fs';
import * as path from 'path';
import type { RawArticle } from '../src/data/corpus.types.ts';
import { LETTER, normaliseText, tokenize } from './lib/text.ts';

const IN_FILE = path.resolve('data', 'corpus', 'raw_articles.json');

const args = process.argv.slice(2);
const flag = (name: string, fallback: number) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? parseInt(args[i + 1], 10) : fallback;
};
const TOP = flag('--top', 20);
const CTX = flag('--ctx', 0);
const patterns = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));

if (!patterns.length) {
  console.error('Usage: npm run corpus:search -- <pattern> [<pattern>…] [--top N] [--ctx N]');
  process.exit(1);
}
if (!fs.existsSync(IN_FILE)) {
  console.error(`✗ ${IN_FILE} not found. Run: npm run corpus:scrape`);
  process.exit(1);
}

const articles = JSON.parse(fs.readFileSync(IN_FILE, 'utf8')) as RawArticle[];
const text = articles.map(a => normaliseText(a.text)).join('\n');
const freq = new Map<string, number>();
for (const w of tokenize(text)) freq.set(w, (freq.get(w) ?? 0) + 1);
const total = [...freq.values()].reduce((a, b) => a + b, 0);

function contexts(word: string, n: number): string[] {
  const re = new RegExp(`(?<![${LETTER}])${word}(?![${LETTER}])`, 'gi');
  const out: string[] = [];
  for (const m of text.matchAll(re)) {
    if (out.length >= n) break;
    const i = m.index ?? 0;
    out.push(
      '…' + text.slice(Math.max(0, i - 60), i + word.length + 60).replace(/\s+/g, ' ') + '…'
    );
  }
  return out;
}

console.log(`Corpus: ${articles.length} articles, ${total.toLocaleString()} words.`);
for (const p of patterns) {
  const re = new RegExp(`^(?:${p})$`);
  const hits = [...freq].filter(([w]) => re.test(w)).sort((a, b) => b[1] - a[1]);
  const tokens = hits.reduce((n, [, c]) => n + c, 0);
  console.log(`\n## ${p} — ${hits.length} forms, ${tokens} tokens`);
  console.log(
    '  ' +
      (hits
        .slice(0, TOP)
        .map(([w, c]) => `${w}(${c})`)
        .join(' ') || '(none)')
  );
  for (const [w] of hits.slice(0, CTX ? 5 : 0))
    for (const c of contexts(w, CTX)) console.log('    ' + c);
}
