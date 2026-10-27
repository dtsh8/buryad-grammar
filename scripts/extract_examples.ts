#!/usr/bin/env node
// ─── extract_examples.ts ──────────────────────────────────────────────────
// Reads data/corpus/raw_articles.json, splits into sentences, then for each
// grammar feature extracts sentences that contain its characteristic morphemes.
// Writes per-feature JSON files to public/data/examples_<feature>.json.
//
// Usage:  npx tsx scripts/extract_examples.ts

import * as fs from 'fs';
import * as path from 'path';
import type { RawArticle, CorpusExample, FeatureExamples } from './types.ts';

const IN_FILE = path.resolve('data', 'corpus', 'raw_articles.json');
const OUT_DIR = path.resolve('public', 'data');

// ─── Cyrillic + Buryad-specific Unicode ranges ────────────────────────────
// а-я + А-Я + ё + Ё + ү (U+04AF) + Ү (U+04AE) + ő (U+04E9) + Ő (U+04E8)
//   + ħ/h (U+04BB SHHA) + Ħ (U+04BA)
const C = '[а-яёА-ЯЁ\u04AF\u04AE\u04E8\u04E9\u04BB\u04BC]+';

// ─── Grammar feature definitions ─────────────────────────────────────────

const FEATURES: Array<{
  id: string;
  label: string;
  description: string;
  patterns: RegExp[];
  maxExamples: number;
}> = [
  // ── Cases ──────────────────────────────────────────────────────────────
  {
    id: 'case_genitive',
    label: 'Genitive case',
    description: 'Suffix -ай/-эй/-ой/-н',
    // long chain then suffix + space + another word
    patterns: [new RegExp(`${C}(ай|эй|ой)\\s+${C}`), new RegExp(`${C}(ын|ийн)\\s+${C}`)],
    maxExamples: 30,
  },
  {
    id: 'case_dative',
    label: 'Dative-Locative case',
    description: 'Suffix -да/-дэ/-до/-та/-тэ/-то',
    patterns: [new RegExp(`${C}(дэ|да|до|тэ|та|то)\\s`)],
    maxExamples: 30,
  },
  {
    id: 'case_instrumental',
    label: 'Instrumental case',
    description: 'Suffix -аар/-ээр/-оор',
    patterns: [new RegExp(`${C}(аар|ээр|оор|гаар|гээр|гоор)\\s`)],
    maxExamples: 30,
  },
  {
    id: 'case_comitative',
    label: 'Comitative case',
    description: 'Suffix -тай/-тэй/-той',
    patterns: [new RegExp(`${C}(тай|тэй|той)\\s`)],
    maxExamples: 30,
  },
  {
    id: 'case_ablative',
    label: 'Ablative case',
    description: 'Suffix -hаа/-hэй/-hоо (h = U+04BB SHHA)',
    // Buryad ablative uses SHHA (ħ U+04BB)
    patterns: [new RegExp(`${C}(\u04BBаа|\u04BBоо|\u04BBэй|\u04BBээ)`)],
    maxExamples: 30,
  },

  // ── Verb finite forms ─────────────────────────────────────────────────
  {
    id: 'verb_simple_past',
    label: 'Simple Past (direct evidential)',
    description: 'Suffix -ба/-бэ/-бо',
    patterns: [new RegExp(`${C}(баа|бэ|бо)\\s`)],
    maxExamples: 25,
  },
  {
    id: 'verb_evidential_past',
    label: 'Evidential Past (indirect)',
    description: 'Suffix -лай/-лэй/-лой',
    patterns: [new RegExp(`${C}(лай|лэй|лой)\\s`)],
    maxExamples: 25,
  },
  {
    id: 'verb_habitual',
    label: 'Habitual aspect',
    description: 'Suffix -даг/-дэг/-дог',
    patterns: [new RegExp(`${C}(даг|дэг|дог)\\s`)],
    maxExamples: 25,
  },
  {
    id: 'verb_negation',
    label: 'Negation',
    description: 'Suffix -гүй',
    patterns: [new RegExp(`${C}г\u04AF\u0439`)],
    maxExamples: 25,
  },

  // ── Converbs ───────────────────────────────────────────────────────────
  {
    id: 'converb_simultaneous',
    label: 'Simultaneous converb',
    description: 'Suffix -жа/-жэ/-жо (while doing)',
    patterns: [new RegExp(`${C}(жа|жэ|жо)\\s+${C}`)],
    maxExamples: 25,
  },
  {
    id: 'converb_sequential',
    label: 'Sequential converb',
    description: 'Suffix -аад/-оод/-ээд (having done)',
    patterns: [new RegExp(`${C}(аад|оод|ааб|ооб|ээд|\u04E9\u04E9д)\\s+${C}`)],
    maxExamples: 25,
  },

  // ── Derivation ─────────────────────────────────────────────────────────
  {
    id: 'deriv_causative',
    label: 'Causative voice',
    description: 'Suffix -уул/-үүл (make/let someone do)',
    patterns: [new RegExp(`${C}(уул|\u04AF\u04AFL)(ха|хэ|на|нэ|ба|бэ)`)],
    maxExamples: 20,
  },
  {
    id: 'deriv_passive',
    label: 'Passive voice',
    description: 'Suffix -гда/-гдэ (be done to)',
    patterns: [new RegExp(`${C}(гда|гдэ)(на|нэ|ба|бэ|лай)`)],
    maxExamples: 20,
  },
];

// ─── Sentence splitting ───────────────────────────────────────────────────

function splitSentences(text: string, url: string, date: string) {
  // Split on sentence-ending punctuation followed by space + capital
  // Handles both Latin full stop and Cyrillic-context periods
  return text
    .split(/(?<=[.!?»])\s+(?=[А-ЯЁҮӨHА-Я\u04BB\u04BC\u04AE\u04B0])/)
    .map(s => s.trim())
    .filter(s => {
      return (
        s.length >= 25 &&
        s.length <= 400 &&
        // Must contain at least one Buryad/Cyrillic word ≥3 letters
        /[а-яёА-ЯЁ\u04AF\u04E9\u04BB]{3}/.test(s)
      );
    })
    .map(text => ({ text, source: url, date }));
}

// ─── Main ────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(IN_FILE)) {
    console.error(`✗ ${IN_FILE} not found. Run 'npx tsx scripts/scrape.ts' first.`);
    process.exit(1);
  }

  const articles: RawArticle[] = JSON.parse(fs.readFileSync(IN_FILE, 'utf8'));
  console.log(`Loaded ${articles.length} articles.`);

  const allSentences = articles.flatMap(a => splitSentences(a.text, a.url, a.date));
  console.log(`Total sentences: ${allSentences.length}\n`);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  let totalExamples = 0;
  for (const feat of FEATURES) {
    const examples: CorpusExample[] = [];
    const seen = new Set<string>();

    for (const sent of allSentences) {
      if (examples.length >= feat.maxExamples) break;
      if (seen.has(sent.text)) continue;

      const matchedPattern = feat.patterns.find(p => p.test(sent.text));
      if (matchedPattern) {
        seen.add(sent.text);
        examples.push({
          sentence: sent.text,
          source: sent.source,
          date: sent.date,
          matchedPattern: matchedPattern.source,
        });
      }
    }

    const result: FeatureExamples = {
      feature: feat.id,
      pattern: `${feat.label} — ${feat.description}`,
      examples,
    };

    const outFile = path.join(OUT_DIR, `examples_${feat.id}.json`);
    fs.writeFileSync(outFile, JSON.stringify(result, null, 2), 'utf8');
    totalExamples += examples.length;
    console.log(`✓ ${feat.id}: ${examples.length} examples`);
  }

  console.log(`\nTotal: ${totalExamples} examples from ${allSentences.length} sentences.`);
  console.log('All example files written to public/data/.');
}

main().catch(e => { console.error(e); process.exit(1); });
