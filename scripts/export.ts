#!/usr/bin/env node
// ─── export.ts ─────────────────────────────────────────────────────────────
//
// PURPOSE
// -------
// Queries corpus.db and writes a small, curated set of JSON files to
// public/data/.  These are the only data files the deployed app ever loads.
//
// WHY SMALL FILES INSTEAD OF DEPLOYING THE DATABASE?
// ---------------------------------------------------
// The full corpus.db can grow to megabytes.  The app only needs:
//   • 25-30 example sentences per grammar feature
//   • The top 2 000 vocabulary words (not 8 000+)
// Exporting keeps each public JSON file under ~50 KB.
//
// WHAT GETS WRITTEN
// -----------------
//   public/data/examples_<feature>.json  — one file per grammar feature
//   public/data/vocabulary_freq.json     — top 2 000 frequency-ranked words
//
// USAGE
// -----
//   npx tsx scripts/export.ts
//   npx tsx scripts/export.ts --examples-per-feature 50 --vocab-limit 3000

import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

// ─── Config ───────────────────────────────────────────────────────────────

const DB_PATH  = path.resolve('data', 'corpus.db');
const OUT_DIR  = path.resolve('public', 'data');

const args = process.argv.slice(2);
const EXAMPLES_PER_FEATURE = parseInt(args[args.indexOf('--examples-per-feature') + 1] ?? '30', 10);
const VOCAB_LIMIT          = parseInt(args[args.indexOf('--vocab-limit')  + 1]          ?? '2000', 10);

// ─── Grammar feature metadata (labels + descriptions for the JSON) ────────
const FEATURE_META: Record<string, { label: string; description: string }> = {
  case_genitive:     { label: 'Genitive case',          description: 'Suffix -ай/-эй/-ой/-н (possession)' },
  case_dative:       { label: 'Dative-Locative case',   description: 'Suffix -да/-дэ/-до (location/direction)' },
  case_instrumental: { label: 'Instrumental case',      description: 'Suffix -аар/-ээр/-оор (means/path)' },
  case_comitative:   { label: 'Comitative case',        description: 'Suffix -тай/-тэй/-той (with/having)' },
  case_ablative:     { label: 'Ablative case',          description: 'Suffix -һаа/-һээ/-һоо/-һөө (from/than)' },
  verb_simple_past:  { label: 'Simple Past',            description: 'Suffix -ба/-бэ/-бо (direct evidence)' },
  verb_evidential:   { label: 'Evidential Past',        description: 'Suffix -лай/-лэй/-лой (inference/hearsay)' },
  verb_habitual:     { label: 'Habitual aspect',        description: 'Suffix -даг/-дэг/-дог (recurring action)' },
  verb_negation:     { label: 'Negation',               description: 'Suffix -гүй (negative verb form)' },
  converb_simult:    { label: 'Simultaneous converb',   description: 'Suffix -жа/-жэ/-жо (while doing)' },
  converb_seq:       { label: 'Sequential converb',     description: 'Suffix -аад/-оод/-ээд (having done)' },
  deriv_causative:   { label: 'Causative voice',        description: 'Suffix -уул/-үүл (make/let do)' },
  deriv_passive:     { label: 'Passive voice',          description: 'Suffix -гда/-гдэ (be done to)' },
};

// ─── Stop-words excluded from vocabulary export ───────────────────────────
// Very frequent grammatical particles that carry no standalone lexical value.
const STOP_WORDS = new Set([
  'гэжэ', 'гэһэн', 'болон', 'байна', 'байгаа', 'байха', 'юм', 'тиигэжэ',
  'тиин', 'үшөө', 'бас', 'мүн', 'энэ', 'тэрэ', 'эдэ', 'тэдэ',
  'манай', 'таанай', 'хэн', 'юун', 'яагаад', 'тиимэ', 'үгы',
]);

// ─── Main ─────────────────────────────────────────────────────────────────

function main() {
  // 1. Open database read-only — never modify data in export scripts
  if (!fs.existsSync(DB_PATH)) {
    console.error(`✗ ${DB_PATH} not found.\n  Run: npm run corpus:build-db`);
    process.exit(1);
  }
  const db = new Database(DB_PATH, { readonly: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // ── A. Export grammar feature examples ────────────────────────────────

  // This single prepared statement does a JOIN across three tables:
  //   examples (feature label) → sentences (text) → articles (source URL + date)
  // ORDER BY RANDOM() gives variety — different sentences each time you re-export.
  const exampleQuery = db.prepare<[string, number]>(`
    SELECT
      s.text       AS sentence,
      a.url        AS source,
      a.date       AS date
    FROM      examples  e
    JOIN      sentences s ON s.id = e.sentence_id
    JOIN      articles  a ON a.id = s.article_id
    WHERE     e.feature = ?
    ORDER BY  RANDOM()
    LIMIT     ?
  `);

  const features = Object.keys(FEATURE_META);
  let totalExamples = 0;

  for (const featureId of features) {
    const rows = exampleQuery.all(featureId, EXAMPLES_PER_FEATURE) as Array<{
      sentence: string; source: string; date: string;
    }>;

    const meta = FEATURE_META[featureId];
    const output = {
      feature:     featureId,
      label:       meta.label,
      description: meta.description,
      count:       rows.length,
      examples: rows.map(r => ({
        sentence: r.sentence,
        source:   r.source,
        date:     r.date,
      })),
    };

    const outFile = path.join(OUT_DIR, `examples_${featureId}.json`);
    fs.writeFileSync(outFile, JSON.stringify(output, null, 2), 'utf8');
    totalExamples += rows.length;
    console.log(`✓ examples_${featureId}.json  (${rows.length} sentences)`);
  }
  console.log(`\nTotal examples exported: ${totalExamples}\n`);

  // ── B. Export vocabulary frequency list ───────────────────────────────

  // Get total corpus size for metadata
  const { total_words: totalWords } = db.prepare(
    `SELECT SUM(word_count) AS total_words FROM articles`
  ).get() as { total_words: number };

  const { unique_words: uniqueWords } = db.prepare(
    `SELECT COUNT(*) AS unique_words FROM vocab`
  ).get() as { unique_words: number };

  // Export top N words, excluding stop-words.
  // The SQL does the heavy lifting; we just filter stop-words in JS
  // (WHERE NOT IN on a large in-memory set is faster here than SQL IN clause)
  const allVocab = db.prepare<[number]>(`
    SELECT word, count, per_mille
    FROM   vocab
    ORDER  BY count DESC
    LIMIT  ?
  `).all(VOCAB_LIMIT * 2) as Array<{ word: string; count: number; per_mille: number }>;

  const filteredVocab = allVocab
    .filter(r => !STOP_WORDS.has(r.word))
    .slice(0, VOCAB_LIMIT);

  const vocabOutput = {
    totalWords,
    uniqueWords,
    exportedWords: filteredVocab.length,
    generatedAt: new Date().toISOString(),
    entries: filteredVocab,
  };

  const vocabFile = path.join(OUT_DIR, 'vocabulary_freq.json');
  fs.writeFileSync(vocabFile, JSON.stringify(vocabOutput, null, 2), 'utf8');
  console.log(`✓ vocabulary_freq.json  (${filteredVocab.length} words, top ${VOCAB_LIMIT})`);

  // ── C. Print size report ───────────────────────────────────────────────

  console.log('\nFile sizes:');
  const files = [
    ...features.map(f => `examples_${f}.json`),
    'vocabulary_freq.json',
  ];
  let totalBytes = 0;
  for (const file of files) {
    const fp = path.join(OUT_DIR, file);
    const bytes = fs.existsSync(fp) ? fs.statSync(fp).size : 0;
    totalBytes += bytes;
    console.log(`  ${file.padEnd(45)} ${(bytes / 1024).toFixed(1)} KB`);
  }
  console.log(`  ${'TOTAL'.padEnd(45)} ${(totalBytes / 1024).toFixed(1)} KB`);

  db.close();
  console.log('\n✓ Export complete → public/data/');
}

main();
