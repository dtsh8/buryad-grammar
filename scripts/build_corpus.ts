#!/usr/bin/env node
// ─── build_corpus.ts ──────────────────────────────────────────────────────
// Reads data/corpus/raw_articles.json (from scrape.ts), finds example sentences
// for each grammar feature in scripts/lib/features.ts, and writes the one file
// the app loads: public/data/corpus_examples.json.
//
// Usage:  npm run corpus:build [-- --per-feature 12]

import * as fs from 'fs';
import * as path from 'path';
import type { CorpusExample, CorpusExamplesData, RawArticle } from '../src/data/corpus.types.ts';
import { FEATURES, findMatch } from './lib/features.ts';
import { normaliseText, splitSentences, tokenize } from './lib/text.ts';

const IN_FILE = path.resolve('data', 'corpus', 'raw_articles.json');
const OUT_FILE = path.resolve('public', 'data', 'corpus_examples.json');

const args = process.argv.slice(2);
const flag = (name: string, fallback: string) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const PER_FEATURE = parseInt(flag('--per-feature', '12'), 10);

// Selection limits keep the examples varied and readable.
const MAX_PER_WORD = 2; // the same matched word at most twice
const MAX_PER_ARTICLE = 3;
const READABLE = (s: string) => s.length >= 40 && s.length <= 180;

function main() {
  if (!fs.existsSync(IN_FILE)) {
    console.error(`✗ ${IN_FILE} not found. Run: npm run corpus:scrape`);
    process.exit(1);
  }
  const articles = JSON.parse(fs.readFileSync(IN_FILE, 'utf8')) as RawArticle[];

  const sentences = articles.flatMap(a =>
    splitSentences(normaliseText(a.text)).map(sentence => ({
      sentence,
      url: a.url,
      title: a.title,
    }))
  );
  const words = articles.reduce((n, a) => n + tokenize(normaliseText(a.text)).length, 0);

  const out: CorpusExamplesData = {
    source: 'Буряад үнэн (burunen.ru)',
    generatedAt: new Date().toISOString(),
    articles: articles.length,
    sentences: sentences.length,
    words,
    features: {},
  };

  for (const f of FEATURES) {
    const hits: CorpusExample[] = [];
    for (const s of sentences) {
      const match = findMatch(s.sentence, f);
      if (match) hits.push({ ...s, match });
    }
    // Readable sentences first; otherwise keep corpus order, so output is stable.
    const ordered = [
      ...hits.filter(h => READABLE(h.sentence)),
      ...hits.filter(h => !READABLE(h.sentence)),
    ];
    const perWord = new Map<string, number>();
    const perArticle = new Map<string, number>();
    const chosen: CorpusExample[] = [];
    for (const h of ordered) {
      if (chosen.length >= PER_FEATURE) break;
      const w = h.match.toLowerCase();
      if ((perWord.get(w) ?? 0) >= MAX_PER_WORD || (perArticle.get(h.url) ?? 0) >= MAX_PER_ARTICLE)
        continue;
      if (chosen.some(c => c.sentence === h.sentence)) continue;
      perWord.set(w, (perWord.get(w) ?? 0) + 1);
      perArticle.set(h.url, (perArticle.get(h.url) ?? 0) + 1);
      chosen.push(h);
    }
    out.features[f.id] = {
      label: f.label,
      description: f.description,
      total: hits.length,
      examples: chosen,
    };
    console.log(
      `  ${f.id.padEnd(24)} ${String(hits.length).padStart(5)} matches, ${chosen.length} kept`
    );
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2) + '\n', 'utf8');
  const kb = (fs.statSync(OUT_FILE).size / 1024).toFixed(1);
  console.log(
    `\n✓ ${articles.length} articles, ${sentences.length} sentences, ${words} words → ${OUT_FILE} (${kb} KB)`
  );
}

main();
