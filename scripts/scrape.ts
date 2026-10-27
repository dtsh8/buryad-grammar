#!/usr/bin/env node
// ─── scrape.ts ─────────────────────────────────────────────────────────────
// Crawls https://burunen.ru/bur/ news listing pages and saves raw article
// text to data/corpus/raw_articles.json.
//
// Usage:  npx tsx scripts/scrape.ts [--pages 5] [--delay 1500]
//
// Respects robots.txt spirit: 1.5 s delay between requests (adjustable).
// All data stays local — run this script manually before deploying.

import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

// ─── Config ───────────────────────────────────────────────────────────────

const BASE_URL = 'https://burunen.ru';
const BUR_NEWS = `${BASE_URL}/bur/news/`;
const OUT_DIR = path.resolve('data', 'corpus');
const OUT_FILE = path.join(OUT_DIR, 'raw_articles.json');

const args = process.argv.slice(2);
const MAX_PAGES = parseInt(args[args.indexOf('--pages') + 1] ?? '10', 10);
const DELAY_MS = parseInt(args[args.indexOf('--delay') + 1] ?? '1500', 10);

// ─── Helpers ──────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function fetchHTML(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'BuryaadGrammarBot/1.0 (educational corpus; contact via GitHub)',
        Accept: 'text/html',
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

  for (let page = 1; page <= maxPages; page++) {
    const listUrl = page === 1 ? BUR_NEWS : `${BUR_NEWS}?PAGEN_1=${page}`;
    console.log(`Listing page ${page}/${maxPages}: ${listUrl}`);
    const html = await fetchHTML(listUrl);
    if (!html) break;

    const $ = cheerio.load(html);
    // Article links in listing: <a href="/bur/news/…"> inside .b-article or .news-item
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') ?? '';
      if (/^\/bur\/news\/[^/]+\/\d+/.test(href)) {
        urls.add(BASE_URL + href.replace(/\?.*/, ''));
      }
    });
    console.log(`  found ${urls.size} URLs so far`);
    await sleep(DELAY_MS);
  }

  return [...urls];
}

// ─── Article body extraction ───────────────────────────────────────────────

function extractArticle(html: string, url: string) {
  const $ = cheerio.load(html);

  const title = $('h1').first().text().trim();
  const date =
    $('time').attr('datetime') ??
    $('[class*="date"]').first().text().trim() ??
    '';
  const category =
    $('[class*="category"], [class*="rubric"], [class*="section"]').first().text().trim() ?? '';

  // Body: try several selectors in priority order
  let bodyEl =
    $('.b-article .b-content') ||
    $('[class*="detail-text"]') ||
    $('[class*="article-body"]') ||
    $('article');

  // Fall back: find the largest <div> containing Buryad text (Cyrillic)
  if (!bodyEl.text().trim()) {
    let maxLen = 0;
    $('div, section').each((_, el) => {
      const t = $(el).text();
      if (t.length > maxLen && /[а-яёА-ЯЁ]{5}/.test(t)) {
        maxLen = t.length;
        bodyEl = $(el);
      }
    });
  }

  // Clean the text
  bodyEl.find('script, style, .social, .share, .ads, [class*="adv"]').remove();
  const raw = bodyEl.text();
  const text = raw
    .replace(/\s+/g, ' ')
    .replace(/[^\u0400-\u04FF\u04E8\u04E9\u04AE\u04AF\s.,!?;:—–\-«»""]/g, '')
    .trim();

  return { url, title, date, category, text };
}

// ─── Main ────────────────────────────────────────────────────────────────

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Load previously scraped articles to allow resuming
  let existing: Record<string, unknown>[] = [];
  if (fs.existsSync(OUT_FILE)) {
    existing = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8'));
    console.log(`Resuming — ${existing.length} articles already scraped.`);
  }
  const existingUrls = new Set(existing.map(a => (a as { url: string }).url));

  console.log(`\nCollecting article URLs (up to ${MAX_PAGES} listing pages)…`);
  const allUrls = await collectArticleUrls(MAX_PAGES);
  const newUrls = allUrls.filter(u => !existingUrls.has(u));
  console.log(`\n${allUrls.length} total URLs — ${newUrls.length} new to scrape.\n`);

  const articles = [...existing];
  let scraped = 0;

  for (const url of newUrls) {
    process.stdout.write(`[${++scraped}/${newUrls.length}] ${url.split('/').slice(-2, -1)[0]}… `);
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
    articles.push(article);
    console.log(`ok (${article.text.length} chars)`);

    // Save after every 10 articles so progress isn't lost on interruption
    if (scraped % 10 === 0) {
      fs.writeFileSync(OUT_FILE, JSON.stringify(articles, null, 2), 'utf8');
    }
    await sleep(DELAY_MS);
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(articles, null, 2), 'utf8');
  console.log(`\n✓ Saved ${articles.length} articles → ${OUT_FILE}`);
}

main().catch(e => { console.error(e); process.exit(1); });
