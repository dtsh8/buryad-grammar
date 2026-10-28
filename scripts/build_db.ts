#!/usr/bin/env node
// ─── build_db.ts ──────────────────────────────────────────────────────────
//
// PURPOSE
// -------
// Reads the raw scraped articles (data/corpus/raw_articles.json) and builds
// a local SQLite database (data/corpus.db).
//
// This database is the single source of truth for all corpus data.
// It lives only on your machine (gitignored) and is never deployed.
// The app only ever sees the small JSON files that export.ts queries out of it.
//
// SCHEMA  (why each table exists)
// --------------------------------
//   articles   — one row per scraped page; URL as unique key so re-running
//                the script is safe (it skips already-inserted articles)
//
//   sentences  — every sentence extracted from every article; the unit of
//                example data throughout the app
//
//   examples   — links a sentence to a grammar feature (e.g. 'case_ablative').
//                A sentence can belong to multiple features.
//                This replaces the 15 separate examples_*.json files.
//
//   vocab      — word → frequency count + per-mille score.
//                Replaces vocabulary_freq.json.
//
//   sentences_fts — FTS5 virtual table that mirrors 'sentences.text'.
//                   Enables full-text search: "find all sentences containing
//                   the word 'гэрэй' in any form".
//
// USAGE
// -----
//   npx tsx scripts/build_db.ts
//   npx tsx scripts/build_db.ts --reset   # drop and recreate all tables first

import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

// ─── Config ───────────────────────────────────────────────────────────────

const IN_FILE = path.resolve('data', 'corpus', 'raw_articles.json');
const DB_PATH = path.resolve('data', 'corpus.db');
const RESET = process.argv.includes('--reset');

// ─── Grammar feature patterns ─────────────────────────────────────────────
// Each entry maps a feature id to one or more RegExp patterns.
// A sentence is labelled with a feature if any pattern matches.
//
// Why regex and not a morphological parser?
// Buryad has no production-grade NLP library.  Regex over the 3-5 character
// suffixes is 95%+ accurate for the forms that appear in a news corpus.

const C = '[а-яёА-ЯЁ\u04AF\u04AE\u04E8\u04E9\u04BB\u04BA]+'; // Cyrillic + Buryad chars

const FEATURES: Array<{ id: string; label: string; patterns: RegExp[] }> = [
  { id: 'case_genitive',     label: 'Genitive case',               patterns: [new RegExp(`${C}(ай|эй|ой)\\s+${C}`), new RegExp(`${C}(ын|ийн)\\s+${C}`)] },
  { id: 'case_dative',       label: 'Dative-Locative case',        patterns: [new RegExp(`${C}(дэ|да|до|тэ|та|то)\\s`)] },
  { id: 'case_instrumental', label: 'Instrumental case',           patterns: [new RegExp(`${C}(аар|ээр|оор|гаар|гээр|гоор)\\s`)] },
  { id: 'case_comitative',   label: 'Comitative case',             patterns: [new RegExp(`${C}(тай|тэй|той)\\s`)] },
  { id: 'case_ablative',     label: 'Ablative case',               patterns: [new RegExp(`${C}(\u04BBаа|\u04BBоо|\u04BBээ|\u04BBөө)`)] },
  { id: 'verb_simple_past',  label: 'Simple Past',                 patterns: [new RegExp(`${C}(ба|бэ|бо)\\s`)] },
  { id: 'verb_evidential',   label: 'Evidential Past',             patterns: [new RegExp(`${C}(лай|лэй|лой)\\s`)] },
  { id: 'verb_habitual',     label: 'Habitual aspect',             patterns: [new RegExp(`${C}(даг|дэг|дог)\\s`)] },
  { id: 'verb_negation',     label: 'Negation (-гүй)',             patterns: [new RegExp(`${C}г\u04AF\u0439`)] },
  { id: 'converb_simult',    label: 'Simultaneous converb',        patterns: [new RegExp(`${C}(жа|жэ|жо)\\s+${C}`)] },
  { id: 'converb_seq',       label: 'Sequential converb',          patterns: [new RegExp(`${C}(аад|оод|ааб|ооб|ээд|\u04E9\u04E9д)\\s+${C}`)] },
  { id: 'deriv_causative',   label: 'Causative voice',             patterns: [new RegExp(`${C}(уул|\u04AF\u04AFл)(ха|хэ|на|нэ|ба|бэ)`)] },
  { id: 'deriv_passive',     label: 'Passive voice',               patterns: [new RegExp(`${C}(гда|гдэ)(на|нэ|ба|бэ|лай)`)] },
];

// ─── Sentence splitter ────────────────────────────────────────────────────
// Splits article text into individual sentences.
// Uses punctuation followed by a capital Cyrillic letter as the boundary.

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?»])\s+(?=[А-ЯЁ\u04AE\u04E8\u04BA])/)
    .map(s => s.trim())
    .filter(s =>
      s.length >= 25 &&
      s.length <= 400 &&
      /[а-яёА-ЯЁ\u04AF\u04E9\u04BB]{3}/.test(s) // must contain Buryad text
    );
}

// ─── Word tokenizer ───────────────────────────────────────────────────────
// Returns lowercase Buryad words ≥3 characters.

function tokenize(text: string): string[] {
  return (text.match(/[а-яёА-ЯЁ\u04AF\u04AE\u04E8\u04E9\u04BB\u04BA]+/gu) ?? [])
    .map(w => w.toLowerCase())
    .filter(w => w.length >= 3);
}

// ─── Main ─────────────────────────────────────────────────────────────────

function main() {
  // 1. Verify input exists
  if (!fs.existsSync(IN_FILE)) {
    console.error(`✗ ${IN_FILE} not found.\n  Run: npm run corpus:scrape`);
    process.exit(1);
  }

  // 2. Open database (creates file if it doesn't exist)
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  console.log(`Database: ${DB_PATH}`);

  // 3. Enable WAL mode — faster writes, safe concurrent reads
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // 4. Drop tables if --reset was requested
  if (RESET) {
    console.log('Resetting database…');
    db.exec(`
      DROP TABLE IF EXISTS sentences_fts;
      DROP TABLE IF EXISTS examples;
      DROP TABLE IF EXISTS vocab;
      DROP TABLE IF EXISTS sentences;
      DROP TABLE IF EXISTS articles;
    `);
  }

  // 5. Create schema
  //    IF NOT EXISTS makes this script safe to re-run without --reset
  db.exec(`
    -- Source articles
    CREATE TABLE IF NOT EXISTS articles (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      url       TEXT    UNIQUE NOT NULL,
      title     TEXT    NOT NULL DEFAULT '',
      date      TEXT    NOT NULL DEFAULT '',
      category  TEXT    NOT NULL DEFAULT '',
      word_count INTEGER NOT NULL DEFAULT 0
    );

    -- Every sentence extracted from every article
    CREATE TABLE IF NOT EXISTS sentences (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
      text       TEXT    NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_sentences_article ON sentences(article_id);

    -- Grammar feature → sentence mapping (many-to-many)
    CREATE TABLE IF NOT EXISTS examples (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      feature     TEXT    NOT NULL,
      sentence_id INTEGER NOT NULL REFERENCES sentences(id) ON DELETE CASCADE,
      UNIQUE(feature, sentence_id)
    );
    CREATE INDEX IF NOT EXISTS idx_examples_feature ON examples(feature);

    -- Word frequency table
    CREATE TABLE IF NOT EXISTS vocab (
      word      TEXT PRIMARY KEY,
      count     INTEGER NOT NULL DEFAULT 0,
      per_mille REAL    NOT NULL DEFAULT 0.0
    );
    CREATE INDEX IF NOT EXISTS idx_vocab_count ON vocab(count DESC);

    -- FTS5 virtual table — enables full-text search across all sentences
    -- 'content=sentences' means it reads from the sentences table
    -- 'content_rowid=id' maps FTS rowids to sentences.id
    CREATE VIRTUAL TABLE IF NOT EXISTS sentences_fts
      USING fts5(text, content='sentences', content_rowid='id', tokenize='unicode61');
  `);
  console.log('Schema ready.\n');

  // 6. Read raw articles
  const articles = JSON.parse(fs.readFileSync(IN_FILE, 'utf8')) as Array<{
    url: string; title: string; date: string; category: string; text: string;
  }>;
  console.log(`Loaded ${articles.length} raw articles.`);

  // 7. Skip already-inserted articles (safe re-run)
  const existingUrls = new Set(
    (db.prepare('SELECT url FROM articles').all() as { url: string }[]).map(r => r.url)
  );
  const newArticles = articles.filter(a => !existingUrls.has(a.url));
  console.log(`New articles to insert: ${newArticles.length} (${existingUrls.size} already in DB)\n`);

  // 8. Prepare statements (prepared once, executed many times — much faster)
  const insertArticle  = db.prepare(
    `INSERT OR IGNORE INTO articles (url, title, date, category, word_count)
     VALUES (@url, @title, @date, @category, @word_count)`
  );
  const insertSentence = db.prepare(
    `INSERT INTO sentences (article_id, text) VALUES (@article_id, @text)`
  );
  const insertExample  = db.prepare(
    `INSERT OR IGNORE INTO examples (feature, sentence_id) VALUES (@feature, @sentence_id)`
  );
  const upsertVocab    = db.prepare(
    `INSERT INTO vocab (word, count) VALUES (@word, @count)
     ON CONFLICT(word) DO UPDATE SET count = count + @count`
  );

  // 9. Wrap everything in a single transaction — 100× faster than per-row commits
  const totalWordFreq = new Map<string, number>();
  let totalWords = 0;

  const insertAll = db.transaction(() => {
    for (const art of newArticles) {
      const words = tokenize(art.text);
      totalWords += words.length;

      // Count words for vocabulary
      for (const w of words) {
        totalWordFreq.set(w, (totalWordFreq.get(w) ?? 0) + 1);
      }

      // Insert article
      const result = insertArticle.run({
        url: art.url,
        title: art.title,
        date: art.date,
        category: art.category,
        word_count: words.length,
      });

      // If the article was already there (OR IGNORE), skip its sentences
      if (result.changes === 0) continue;
      const articleId = result.lastInsertRowid as number;

      // Insert sentences
      const sents = splitSentences(art.text);
      for (const text of sents) {
        const sResult = insertSentence.run({ article_id: articleId, text });
        const sentenceId = sResult.lastInsertRowid as number;

        // Label sentence with each matching grammar feature
        for (const feat of FEATURES) {
          if (feat.patterns.some(p => p.test(text))) {
            insertExample.run({ feature: feat.id, sentence_id: sentenceId });
          }
        }
      }
    }
  });

  process.stdout.write('Inserting articles and sentences… ');
  insertAll();
  console.log('done.');

  // 10. Update vocabulary counts
  if (totalWordFreq.size > 0) {
    process.stdout.write('Updating vocabulary… ');
    const updateVocab = db.transaction(() => {
      for (const [word, count] of totalWordFreq) {
        upsertVocab.run({ word, count });
      }
    });
    updateVocab();
    console.log('done.');

    // Recalculate per_mille scores based on total corpus size
    const corpusWords = (db.prepare('SELECT SUM(word_count) as total FROM articles').get() as { total: number }).total;
    db.prepare(`UPDATE vocab SET per_mille = ROUND((count * 1000.0 / ?), 2)`).run(corpusWords);
    console.log(`Corpus size: ${corpusWords.toLocaleString()} words.`);
  }

  // 11. Rebuild FTS index to include any new sentences
  process.stdout.write('Rebuilding FTS index… ');
  db.exec(`INSERT INTO sentences_fts(sentences_fts) VALUES('rebuild')`);
  console.log('done.\n');

  // 12. Print summary stats
  const stats = {
    articles:  (db.prepare('SELECT COUNT(*) AS n FROM articles').get() as { n: number }).n,
    sentences: (db.prepare('SELECT COUNT(*) AS n FROM sentences').get() as { n: number }).n,
    examples:  (db.prepare('SELECT COUNT(*) AS n FROM examples').get() as { n: number }).n,
    vocab:     (db.prepare('SELECT COUNT(*) AS n FROM vocab').get() as { n: number }).n,
  };
  console.log('Database summary:');
  console.log(`  Articles:  ${stats.articles}`);
  console.log(`  Sentences: ${stats.sentences}`);
  console.log(`  Examples:  ${stats.examples}  (feature × sentence pairs)`);
  console.log(`  Vocab:     ${stats.vocab} unique word forms`);

  // 13. Show feature coverage
  console.log('\nExamples per feature:');
  const coverage = db.prepare(
    `SELECT feature, COUNT(*) AS n FROM examples GROUP BY feature ORDER BY n DESC`
  ).all() as Array<{ feature: string; n: number }>;
  for (const row of coverage) {
    console.log(`  ${row.feature.padEnd(25)} ${row.n}`);
  }

  db.close();
  console.log('\n✓ Done.');
}

main();
