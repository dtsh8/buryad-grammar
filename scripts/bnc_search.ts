#!/usr/bin/env node
// ─── bnc_search.ts ────────────────────────────────────────────────────────
// Queries the online Buryat National Corpus (tsakorpus, buryat.web-corpora.net):
// literary, folklore and press texts, much larger than the local news corpus.
// Each argument is a word form; * is a wildcard (tsakorpus syntax).
//
//   npm run corpus:bnc -- эдеэд эдеэгээд
//   npm run corpus:bnc -- "*нхай" --top 30
//   npm run corpus:bnc -- үрдеэд --sent 3          with example sentences
//
// Options: --top N (forms listed, default 15), --sent N (sentences per pattern, default 0).
// The corpus's automatic lemma/grammar tags are often wrong for verb forms
// (эдеэд is tagged as the plural of эдеэн "food"); trust counts and sentences, not tags.
// Requests are sequential with a 1.5 s pause, to be gentle on the server.

const BASE = 'https://buryat.web-corpora.net/buryat_corpus';
const HEADERS = {
  'User-Agent': 'BuryaadGrammarBot/1.0 (educational; github.com/dtsh8/buryad-grammar)',
};
const DELAY_MS = 1500;

const args = process.argv.slice(2);
const flag = (name: string, fallback: number) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? parseInt(args[i + 1], 10) : fallback;
};
const TOP = flag('--top', 15);
const SENT = flag('--sent', 0);
const patterns = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));

if (!patterns.length) {
  console.error('Usage: npm run corpus:bnc -- <form> [<form>…] [--top N] [--sent N]');
  process.exit(1);
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// Text content of an HTML fragment.
const text = (html: string) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!?;:»)])/g, '$1')
    .trim();

async function session(): Promise<string> {
  const res = await fetch(`${BASE}/search`, { headers: HEADERS });
  return res.headers.get('set-cookie')?.split(';')[0] ?? '';
}

async function query(cookie: string, endpoint: string, wf: string): Promise<string> {
  const params = new URLSearchParams({
    n_words: '1',
    wf1: wf,
    lex1: '',
    gr1: '',
    lang1: 'buryat',
    precise: 'on',
    page_size: '50',
    sort: 'freq',
  });
  await sleep(DELAY_MS);
  const res = await fetch(`${BASE}/${endpoint}?${params}`, {
    headers: { ...HEADERS, Cookie: cookie },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${endpoint}`);
  return res.text();
}

interface WordRow {
  form: string;
  freq: number;
  docs: number;
}

function parseWords(html: string): { summary: string; rows: WordRow[] } {
  const summary = text(html.match(/Результат поиска:([\s\S]*?)<\/p>/)?.[1] ?? 'no results');
  const rows = [...html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].flatMap(([, tr]) => {
    const cells = [...tr.matchAll(/<td>([\s\S]*?)<\/td>/g)].map(m => text(m[1]));
    // слово, лемма, грамм., частотность, ранг, предл., док.
    return cells.length >= 7
      ? [{ form: cells[0], freq: Number(cells[3]), docs: Number(cells[6]) }]
      : [];
  });
  return { summary, rows };
}

function parseSentences(html: string, n: number): string[] {
  const blocks = html.split('<div class="context ').slice(1, n + 1);
  return blocks.map(b => {
    const author = text(b.match(/class="ch_author"[^>]*>([\s\S]*?)<\/span>/)?.[1] ?? '');
    const title = text(b.match(/class="ch_title"[^>]*>([\s\S]*?)<\/span>/)?.[1] ?? '');
    const date = text(b.match(/class="ch_date"[^>]*>([\s\S]*?)<\/span>/)?.[1] ?? '');
    // The sentence runs from its span to the expand-context toggle (or the block's end).
    const start = b.indexOf('<span class="sentence"');
    const end = b.indexOf('class="cx_toggle_div"', start);
    const sentence = text(
      start < 0 ? '' : b.slice(start, end < 0 ? undefined : end).replace(/<[^>]*$/, '')
    );
    return `${sentence.slice(0, 220)}  — ${[author, title, date].filter(Boolean).join(', ')}`;
  });
}

async function main() {
  const cookie = await session();
  console.log(`Buryat National Corpus — ${BASE}`);
  for (const p of patterns) {
    const { summary, rows } = parseWords(await query(cookie, 'search_word', p));
    console.log(`\n## ${p} — ${summary}`);
    console.log(
      '  ' +
        (rows
          .slice(0, TOP)
          .map(r => `${r.form}(${r.freq}/${r.docs} docs)`)
          .join(' ') || '(none)')
    );
    if (SENT > 0) {
      for (const s of parseSentences(await query(cookie, 'search_sent', p), SENT))
        console.log('    ' + s);
    }
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
