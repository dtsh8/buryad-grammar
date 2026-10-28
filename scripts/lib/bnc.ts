// ─── Buryat National Corpus client ────────────────────────────────────────
// https://buryat.web-corpora.net/buryat_corpus (tsakorpus). The server is a shared academic
// one: requests are sequential with a pause, and slow responses are retried.

export const BNC_BASE = 'https://buryat.web-corpora.net/buryat_corpus';
const HEADERS = {
  'User-Agent': 'BuryaadGrammarBot/1.0 (educational; github.com/dtsh8/buryad-grammar)',
};
const DELAY_MS = 1500;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// Text content of an HTML fragment.
export const text = (html: string) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!?;:»)])/g, '$1')
    .trim();

async function get(url: string, cookie = ''): Promise<Response> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fetch(url, {
        headers: { ...HEADERS, ...(cookie ? { Cookie: cookie } : {}) },
        signal: AbortSignal.timeout(60_000),
      });
    } catch (e) {
      if (attempt >= 4) throw e;
      await sleep(5000 * attempt);
    }
  }
}

// A search session cookie (tsakorpus keeps query state per session).
export async function session(): Promise<string> {
  const res = await get(`${BNC_BASE}/search`);
  return res.headers.get('set-cookie')?.split(';')[0] ?? '';
}

// One search request; wf is a word form, "a|b" alternatives, * wildcards.
export async function query(cookie: string, endpoint: string, wf: string): Promise<Response> {
  const params = new URLSearchParams({
    n_words: '1',
    wf1: wf,
    lex1: '',
    gr1: '',
    lang1: 'buryat',
    precise: 'on',
    page_size: '100',
    sort: 'freq',
  });
  await sleep(DELAY_MS);
  return get(`${BNC_BASE}/${endpoint}?${params}`, cookie);
}

export interface WordRow {
  form: string;
  freq: number;
  docs: number;
}

export function parseWords(html: string): { summary: string; rows: WordRow[] } {
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

// Token counts for many exact word forms, `batch` per request. The server rejects long
// alternations with HTTP 500, so a failing batch is split until the bad form is isolated
// (an unsearchable form gets no count).
export async function countForms(
  cookie: string,
  forms: string[],
  batch = 20,
  onProgress?: (done: number) => void
): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  async function lookup(part: string[]): Promise<void> {
    const res = await query(cookie, 'search_word', part.join('|'));
    if (res.status === 500 && part.length > 1) {
      const mid = Math.ceil(part.length / 2);
      await lookup(part.slice(0, mid));
      await lookup(part.slice(mid));
      return;
    }
    if (!res.ok) {
      if (res.status === 500) return;
      throw new Error(`HTTP ${res.status}`);
    }
    const found = new Map<string, number>();
    for (const r of parseWords(await res.text()).rows) {
      const w = r.form.toLowerCase();
      found.set(w, (found.get(w) ?? 0) + r.freq);
    }
    for (const f of part) counts.set(f, found.get(f) ?? 0);
  }
  for (let i = 0; i < forms.length; i += batch) {
    await lookup(forms.slice(i, i + batch));
    onProgress?.(Math.min(i + batch, forms.length));
  }
  return counts;
}
