import { useState } from 'react';
import { useCorpusExamples } from '../hooks/useCorpusExamples';
import type { CorpusExample } from '../data/corpus.types';

const SHOWN = 3;

// The sentence with the matched word highlighted.
function Highlighted({ ex }: { ex: CorpusExample }) {
  const i = ex.sentence.indexOf(ex.match);
  if (i < 0) return <>{ex.sentence}</>;
  return (
    <>
      {ex.sentence.slice(0, i)}
      <mark className="bg-amber-200/70 text-stone-900 rounded px-0.5">{ex.match}</mark>
      {ex.sentence.slice(i + ex.match.length)}
    </>
  );
}

// Real sentences from Буряад үнэн for one grammar feature (ids from
// scripts/lib/features.ts). Renders nothing if the feature has no examples
// or the file can't be loaded — the page is complete without it.
export default function CorpusExamples({ feature }: { feature: string }) {
  const { data } = useCorpusExamples();
  const [all, setAll] = useState(false);
  const f = data?.features[feature];
  if (!data || !f || f.examples.length === 0) return null;

  const shown = all ? f.examples : f.examples.slice(0, SHOWN);
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        In the newspaper
      </p>
      <ul className="space-y-1.5">
        {shown.map(ex => (
          <li key={ex.sentence} className="bg-white/70 rounded-lg px-3 py-2 text-sm">
            <p className="font-buryat text-stone-800 leading-relaxed">
              <Highlighted ex={ex} />
            </p>
            <a
              href={ex.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-stone-400 hover:text-buryat-700 underline-offset-2 hover:underline"
            >
              {ex.title || 'Буряад үнэн'} ↗
            </a>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3 flex-wrap text-xs text-stone-400">
        {f.examples.length > SHOWN && (
          <button
            type="button"
            onClick={() => setAll(!all)}
            className="text-buryat-700 hover:underline"
          >
            {all ? 'Show fewer' : `Show ${f.examples.length - SHOWN} more`}
          </button>
        )}
        <span>
          {f.total.toLocaleString()} matches in {data.articles} articles of {data.source}. Found
          automatically by word ending, so a few may be wrong.
        </span>
      </div>
    </div>
  );
}
