import { useEffect, useState } from 'react';
import { buildClassIndex, type ClassIndex, type WordClassData } from '../utils/wordClasses';

// Module-level cache, like useVocabulary: the list is fetched once.
let cache: ClassIndex | null = null;
const EMPTY: ClassIndex = new Map();

// Labels are a help, not the page's content: without the list the Reader simply shows fewer.
export function useWordClasses(): ClassIndex {
  const [classes, setClasses] = useState<ClassIndex>(() => cache ?? EMPTY);

  useEffect(() => {
    if (cache !== null) return;
    fetch(import.meta.env.BASE_URL + 'data/word-classes.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<WordClassData>;
      })
      .then(data => {
        cache = buildClassIndex(data);
        setClasses(cache);
      })
      .catch(() => undefined);
  }, []);

  return classes;
}
