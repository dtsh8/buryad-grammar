import { useState } from 'react';
import { STROKE_PARTS } from '../data/scriptStrokes';
import { useI18n } from '../i18n/context';

// Ink for the first, second and third stroke.
const INK = ['#1c1917', '#a86812', '#0268c8'];

const DRAW_TIME = 0.6; // s per stroke

function start(d: string): [number, number] {
  const [, x, y] = d.match(/^M\s*([\d.]+)\s+([\d.]+)/) ?? [];
  return [Number(x), Number(y)];
}

// The named parts letters are built from, each written stroke by stroke (Skorodumova, pp. 4–5).
export default function StrokeParts() {
  const { lang, t } = useI18n();
  const [id, setId] = useState(STROKE_PARTS[0].id);
  const [run, setRun] = useState(0); // bumping it remounts the drawing, which replays it
  const part = STROKE_PARTS.find(p => p.id === id) ?? STROKE_PARTS[0];
  const gloss = lang === 'en' ? part.en : part.ru;

  function pick(next: string) {
    setId(next);
    setRun(r => r + 1);
  }

  return (
    <div className="space-y-3">
      <div role="group" aria-label={t.script.strokes.label} className="flex flex-wrap gap-1.5">
        {STROKE_PARTS.map(p => (
          <button
            key={p.id}
            type="button"
            lang="mn"
            aria-pressed={p.id === id}
            onClick={() => pick(p.id)}
            className={`rounded-md border px-2 py-1 text-sm ${
              p.id === id
                ? 'border-buryat-400 bg-buryat-50 text-buryat-800'
                : 'border-stone-200 text-stone-700 hover:border-buryat-300'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <svg
          key={run}
          viewBox="0 0 40 56"
          className="h-40 w-auto rounded-xl border border-stone-200 bg-white"
          role="img"
          aria-label={part.name}
        >
          {part.strokes.map((d, i) => (
            <path
              key={i}
              d={d}
              pathLength={1}
              fill="none"
              stroke={INK[i]}
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="draw-stroke"
              style={{ animationDelay: `${i * DRAW_TIME}s`, animationDuration: `${DRAW_TIME}s` }}
            />
          ))}
          {part.strokes.map((d, i) => {
            const [x, y] = start(d);
            return <circle key={i} cx={x} cy={y} r={1.6} fill={INK[i]} />;
          })}
        </svg>
        <div className="space-y-1">
          <p lang="mn" className="text-xl font-semibold text-stone-900">
            {part.name}
          </p>
          {gloss && <p className="text-stone-600">{gloss}</p>}
          <button
            type="button"
            onClick={() => setRun(r => r + 1)}
            className="text-sm font-medium text-buryat-700 underline underline-offset-2"
          >
            {t.script.strokes.replay}
          </button>
        </div>
      </div>
      <p className="text-xs text-stone-500">{t.script.strokes.note}</p>
    </div>
  );
}
