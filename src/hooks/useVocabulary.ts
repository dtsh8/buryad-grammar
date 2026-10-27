import { useState, useEffect } from 'react';
import type { Lexeme, VocabularyData } from '../data/vocabulary.types';

// Module-level cache — data is fetched once and reused across re-renders.
let cache: Lexeme[] | null = null;

interface UseVocabularyResult {
  data: Lexeme[];
  loading: boolean;
  error: string | null;
}

export function useVocabulary(): UseVocabularyResult {
  // Lazy initialisers read cache synchronously — no effect needed for the cached path.
  const [data, setData] = useState<Lexeme[]>(() => cache ?? []);
  const [loading, setLoading] = useState<boolean>(() => cache === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache !== null) return; // already loaded

    const url = import.meta.env.BASE_URL + 'data/vocabulary.json';
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status} fetching ${url}`);
        return r.json() as Promise<VocabularyData>;
      })
      .then(d => {
        cache = d.entries;
        setData(d.entries);
        setLoading(false);
      })
      .catch((e: Error) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
