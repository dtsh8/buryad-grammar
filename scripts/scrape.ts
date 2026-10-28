#!/usr/bin/env node
// ─── scrape.ts ─────────────────────────────────────────────────────────────
// Crawls https://burunen.ru/bur/ news listing pages and saves article text
// to data/corpus/raw_articles.json (gitignored; not deployed).
//
// Usage:  npm run corpus:scrape [-- --pages 10 --delay 1500 --refresh]
//   --refresh  re-download articles already in the file (needed after a change
//              to text cleaning, since the saved text cannot be repaired)
//
// Polite by default: 1.5 s between requests. Run manually, then corpus:build.

import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import type { RawArticle } from '../src/data/corpus.types.ts';
import { normaliseText } from './lib/text.ts';

// ─── Config ───────────────────────────────────────────────────────────────

const BASE_URL = 'https://burunen.ru';
const BUR_NEWS = `${BASE_URL}/bur/news/`;
const OUT_DIR = path.resolve('data', 'corpus');
const OUT_FILE = path.join(OUT_DIR, 'raw_articles.json');

const args = process.argv.slice(2);
const flag = (name: string, fallback: string) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const MAX_PAGES = parseInt(flag('--pages', '10'), 10);
const DELAY_MS = parseInt(flag('--delay', '1500'), 10);
const REFRESH = args.includes('--refresh');

// ─── Helpers ──────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function fetchHTML(url: string, ajax = false): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'BuryaadGrammarBot/1.0 (educational corpus; contact via GitHub)',
        Accept: 'text/html',
        // The site's "load more" pagination only returns new pages to AJAX requests;
        // without this header every page after 2 repeats page 2.
        ...(ajax ? { 'X-Requested-With': 'XMLHttpRequest' } : {}),
      },
    });
    if (!res.ok) {
      console.warn(`  HTTP ${res.status} — ${url}`);
      return null;
    }
    return await res.text();
  } catch (e) {
    console.warn(`  fetch error — ${url}:`, (e as Error).message);
    return null;
  }
}

// ─── Article list: collect URLs from news listing pages ───────────────────

async function collectArticleUrls(maxPages: number): Promise<string[]> {
  const urls = new Set<string>();
  let emptyPages = 0;

  for (let page = 1; page <= maxPages; page++) {
    const listUrl = page === 1 ? BUR_NEWS : `${BUR_NEWS}?PAGEN_1=${page}`;
    console.log(`Listing page ${page}/${maxPages}: ${listUrl}`);
    const html = await fetchHTML(listUrl, page > 1);
    if (!html) break;

    const before = urls.size;
    const $ = cheerio.load(html);
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') ?? '';
      if (/^\/bur\/news\/[^/]+\/\d+/.test(href)) {
        urls.add(BASE_URL + href.replace(/\?.*/, ''));
      }
    });
    console.log(`  found ${urls.size} URLs so far`);
    // Page 2 sometimes repeats page 1, so stop only after two empty pages in a row.
    emptyPages = urls.size === before ? emptyPages + 1 : 0;
    if (emptyPages >= 2) {
      console.log('  two pages without new articles — stopping.');
      break;
    }
    await sleep(DELAY_MS);
  }

  return [...urls];
}

// ─── Article body extraction ───────────────────────────────────────────────

const BODY_SELECTORS = [
  '.b-article .b-content',
  '[class*="detail-text"]',
  '[class*="article-body"]',
  'article',
];

function extractArticle(html: string, url: string): RawArticle {
  const $ = cheerio.load(html);

  const title = normaliseText($('h1').first().text());
  const date = $('time').attr('datetime') || $('[class*="date"]').first().text().trim();
  const category = $('[class*="category"], [class*="rubric"], [class*="section"]')
    .first()
    .text()
    .trim();

  // First selector that has text (a cheerio selection is always truthy, so `||` can't pick one).
  let bodyEl = BODY_SELECTORS.map(sel => $(sel).first()).find(el => el.text().trim());

  // Fall back to the largest block containing Cyrillic text.
  if (!bodyEl) {
    let maxLen = 0;
    $('div, section').each((_, el) => {
      const t = $(el).text();
      if (t.length > maxLen && /[а-яё]{5}/i.test(t)) {
        maxLen = t.length;
        bodyEl = $(el);
      }
    });
  }
  if (!bodyEl) return { url, title, date, category, text: '' };

  bodyEl.find('script, style, .social, .share, .ads, [class*="adv"]').remove();
  return { url, title, date, category, text: normaliseText(bodyEl.text()) };
}

// ─── Main ────────────────────────────────────────────────────────────────

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let existing: RawArticle[] = [];
  if (fs.existsSync(OUT_FILE)) {
    existing = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8')) as RawArticle[];
    console.log(
      `${existing.length} articles already saved${REFRESH ? ' (will re-download)' : ''}.`
    );
  }

  console.log(`\nCollecting article URLs (up to ${MAX_PAGES} listing pages)…`);
  const listed = await collectArticleUrls(MAX_PAGES);
  const known = new Set(existing.map(a => a.url));
  const toFetch = REFRESH
    ? [...new Set([...existing.map(a => a.url), ...listed])]
    : listed.filter(u => !known.has(u));
  console.log(`\n${listed.length} listed — ${toFetch.length} to download.\n`);

  const byUrl = new Map(existing.map(a => [a.url, a]));
  let done = 0;

  for (const url of toFetch) {
    process.stdout.write(`[${++done}/${toFetch.length}] ${url.split('/').slice(-2, -1)[0]}… `);
    const html = await fetchHTML(url);
    if (!html) {
      console.log('skip');
      continue;
    }
    const article = extractArticle(html, url);
    if (article.text.length < 50) {
      console.log(`skip (${article.text.length} chars)`);
      continue;
    }
    byUrl.set(url, article);
    console.log(`ok (${article.text.length} chars)`);

    // Save every 10 articles so progress survives an interruption.
    if (done % 10 === 0)
      fs.writeFileSync(OUT_FILE, JSON.stringify([...byUrl.values()], null, 2), 'utf8');
    await sleep(DELAY_MS);
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify([...byUrl.values()], null, 2), 'utf8');
  console.log(`\n✓ Saved ${byUrl.size} articles → ${OUT_FILE}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
