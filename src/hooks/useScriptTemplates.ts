import { useEffect, useState } from 'react';
import { prepare, type PreparedTemplate, type TemplateData } from '../utils/handwriting';

// Module-level cache, like useWordClasses: the shapes are fetched once, and only when the
// handwriting tab is opened.
let cache: { templates: PreparedTemplate[]; points: number } | null = null;

export function useScriptTemplates() {
  const [data, setData] = useState(cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache !== null) return;
    fetch(import.meta.env.BASE_URL + 'data/script-templates.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<TemplateData>;
      })
      .then(json => {
        cache = { templates: prepare(json), points: json.points };
        setData(cache);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  return { data, error };
}
