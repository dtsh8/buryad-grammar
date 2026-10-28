import { useState, useEffect } from 'react';
import type { CorpusExamplesData } from '../data/corpus.types';

// Module-level cache — the file is fetched once and shared by every panel.
let cache: CorpusExamplesData | null = null;
let pending: Promise<CorpusExamplesData> | null = null;

function load(): Promise<CorpusExamplesData> {
  pending ??= fetch(import.meta.env.BASE_URL + 'data/corpus_examples.json').then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status} fetching corpus examples`);
    return r.json() as Promise<CorpusExamplesData>;
  });
  return pending;
}

interface UseCorpusExamplesResult {
  data: CorpusExamplesData | null;
  error: string | null;
}

export function useCorpusExamples(): UseCorpusExamplesResult {
  const [data, setData] = useState<CorpusExamplesData | null>(() => cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache !== null) return;
    load()
      .then(d => {
        cache = d;
        setData(d);
      })
      .catch((e: Error) => {
        pending = null; // allow a retry on the next mount
        setError(e.message);
      });
  }, []);

  return { data, error };
}
