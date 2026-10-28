#!/usr/bin/env node
// ─── build_vocab.ts ───────────────────────────────────────────────────────
// Reads data/corpus/raw_articles.json, tokenizes all Buryad text, counts
// word frequencies, and writes public/data/vocabulary_freq.json.
//
// Usage:  npx tsx scripts/build_vocab.ts [--min-count 3]

import * as fs from 'fs';
import * as path from 'path';
import type { RawArticle, CorpusVocab } from './types.ts';

const IN_FILE = path.resolve('data', 'corpus', 'raw_articles.json');
const OUT_FILE = path.resolve('public', 'data', 'vocabulary_freq.json');

const args = process.argv.slice(2);
const MIN_COUNT = parseInt(args[args.indexOf('--min-count') + 1] ?? '3', 10);

// ─── Stop words — common Buryad grammatical words to exclude from top list ─
// These are highly frequent but carry no standalone lexical meaning.
const STOP_WORDS = new Set([
  'гэжэ', 'гэһэн', 'болон', 'байна', 'байгаа', 'байха', 'юм', 'юмн',
  'тиигэжэ', 'тиин', 'үшөө', 'бас', 'мүн', 'энэ', 'тэрэ', 'эдэ', 'тэдэ',
  'бидэ', 'манай', 'таанай', 'мэн', 'хэн', 'юун', 'яагаад',
  'тиимэ', 'үгы', 'ба', 'бэ', 'гү', 'лэ', 'ла',
]);

// ─── Tokenizer ────────────────────────────────────────────────────────────

function tokenize(text: string): string[] {
  return (
    text
      // Cyrillic + Buryad letters ү Ү ө Ө һ Һ
      .match(/[а-яёА-ЯЁ\u04AF\u04AE\u04E9\u04E8\u04BB\u04BA]+/gu) ?? []
  )
    .map(w => w.toLowerCase())
    .filter(w => w.length >= 3); // skip very short tokens
}

// ─── Main ────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(IN_FILE)) {
    console.error(`✗ ${IN_FILE} not found. Run 'npx tsx scripts/scrape.ts' first.`);
    process.exit(1);
  }

  const articles: RawArticle[] = JSON.parse(fs.readFileSync(IN_FILE, 'utf8'));
  console.log(`Processing ${articles.length} articles…`);

  const freq = new Map<string, number>();
  let totalWords = 0;

  for (const article of articles) {
    const tokens = tokenize(article.text);
    totalWords += tokens.length;
    for (const tok of tokens) {
      freq.set(tok, (freq.get(tok) ?? 0) + 1);
    }
  }

  // Filter, sort by frequency descending
  const sorted = [...freq.entries()]
    .filter(([word, count]) => count >= MIN_COUNT && !STOP_WORDS.has(word))
    .sort((a, b) => b[1] - a[1])
    .map(([word, count]) => ({
      word,
      count,
      perMille: Math.round((count / totalWords) * 1000 * 100) / 100,
    }));

  const result: CorpusVocab = {
    totalWords,
    uniqueWords: freq.size,
    generatedAt: new Date().toISOString(),
    entries: sorted,
  };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(result, null, 2), 'utf8');

  console.log(`\n✓ Corpus stats:`);
  console.log(`  Total words:   ${totalWords.toLocaleString()}`);
  console.log(`  Unique words:  ${freq.size.toLocaleString()}`);
  console.log(`  After filter:  ${sorted.length.toLocaleString()} (min count: ${MIN_COUNT})`);
  console.log(`\n  Top 20 words:`);
  sorted.slice(0, 20).forEach((e, i) =>
    console.log(`  ${String(i + 1).padStart(2)}. ${e.word.padEnd(20)} ${e.count} (${e.perMille}‰)`)
  );
  console.log(`\n→ Saved: ${OUT_FILE}`);
}

main().catch(e => { console.error(e); process.exit(1); });
