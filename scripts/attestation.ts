#!/usr/bin/env node
// ─── attestation.ts ───────────────────────────────────────────────────────
// Counts every form the app builds for its vocabulary (src/utils/attestationForms.ts) in the
// Buryat National Corpus and writes public/data/attestation.json, which the app uses for
// "found / not found in the corpus" badges. Only counts are stored, never corpus text.
//
// Usage:  npm run attestation              query forms not in the file yet; drop unused ones
//         npm run attestation -- --refresh query every form again
//
// Run it after changing vocabulary.json or an engine rule; a test fails until you do.

import * as fs from 'fs';
import * as path from 'path';
import type { VocabularyData } from '../src/data/vocabulary.types.ts';
import type { AttestationData } from '../src/data/attestation.types.ts';
import { attestationForms } from '../src/utils/attestationForms.ts';
import { countForms, session } from './lib/bnc.ts';

const VOCAB = path.resolve('public', 'data', 'vocabulary.json');
const OUT = path.resolve('public', 'data', 'attestation.json');
const REFRESH = process.argv.includes('--refresh');

async function main() {
  const vocab = JSON.parse(fs.readFileSync(VOCAB, 'utf8')) as VocabularyData;
  const forms = attestationForms(vocab.entries);
  const old: Record<string, number> =
    !REFRESH && fs.existsSync(OUT)
      ? (JSON.parse(fs.readFileSync(OUT, 'utf8')) as AttestationData).counts
      : {};
  const todo = forms.filter(f => !(f in old));
  console.log(`${forms.length} forms; ${todo.length} to look up.`);

  const counts: Record<string, number> = {};
  for (const f of forms) if (f in old) counts[f] = old[f];
  if (todo.length) {
    const cookie = await session();
    const found = await countForms(cookie, todo, 20, done =>
      process.stdout.write(`\r  ${done}/${todo.length}`)
    );
    process.stdout.write('\n');
    for (const [f, n] of found) counts[f] = n;
  }

  const out: AttestationData = {
    source: 'Buryat National Corpus, https://buryat.web-corpora.net/buryat_corpus',
    generatedAt: new Date().toISOString(),
    counts: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'ru'))),
  };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n', 'utf8');
  const zero = Object.values(counts).filter(n => n === 0).length;
  const missing = forms.length - Object.keys(counts).length;
  console.log(
    `✓ ${Object.keys(counts).length} forms (${zero} not found${missing ? `, ${missing} unsearchable` : ''}) → ${OUT}`
  );
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
