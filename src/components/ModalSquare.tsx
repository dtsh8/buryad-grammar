import { useState } from 'react';
import { MODAL_CORNERS, type ModalCorner } from '../data/grammar';
import { gloss } from '../i18n/lang';
import { useI18n } from '../i18n/context';

const CORNER_STYLE: Record<ModalCorner, string> = {
  must: 'border-mongol-300 bg-mongol-50 text-mongol-900',
  needNot: 'border-amber-300 bg-amber-50 text-amber-900',
  may: 'border-green-300 bg-green-50 text-green-900',
  mustNot: 'border-red-300 bg-red-50 text-red-900',
};

// The diagonal lit for each selection: 'down' runs from the top left corner to the bottom
// right, 'up' from the bottom left to the top right.
const DIAGONAL: Record<ModalCorner, 'down' | 'up'> = {
  must: 'down',
  needNot: 'down',
  may: 'up',
  mustNot: 'up',
};

function Diagonal({ on, y1, y2 }: { on: boolean; y1: number; y2: number }) {
  return (
    <line
      x1="25"
      y1={y1}
      x2="75"
      y2={y2}
      vectorEffect="non-scaling-stroke"
      strokeDasharray={on ? undefined : '4 5'}
      strokeWidth={on ? 3 : 1.5}
      className={on ? 'stroke-stone-700' : 'stroke-stone-300'}
    />
  );
}

// The square of opposition. The corners sit in reading order, so each diagonal joins a meaning
// to its exact negation: must ↔ need not, may ↔ must not.
export default function ModalSquare() {
  const { lang, t } = useI18n();
  const s = t.modals.square;
  const [selected, setSelected] = useState<ModalCorner>('must');
  const active = MODAL_CORNERS.find(c => c.id === selected) ?? MODAL_CORNERS[0];

  return (
    <div className="space-y-4">
      <div className="relative">
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <Diagonal on={DIAGONAL[selected] === 'down'} y1={25} y2={75} />
          <Diagonal on={DIAGONAL[selected] === 'up'} y1={75} y2={25} />
        </svg>
        <div className="relative grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-24 sm:gap-y-16">
          {MODAL_CORNERS.map(c => {
            const on = c.id === selected || c.id === active.opposite;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c.id)}
                aria-pressed={c.id === selected}
                className={`rounded-xl border-2 p-3 text-left transition-colors ${
                  on ? CORNER_STYLE[c.id] : 'border-stone-200 bg-white text-stone-600'
                } ${c.id === selected ? 'shadow-md' : ''}`}
              >
                <span className="block text-sm font-bold">{s.corners[c.id]}</span>
                <span lang="bua" className="block mt-1">
                  {c.forms.map(f => (
                    <span key={f} className="block font-buryat text-sm leading-snug">
                      {f}
                    </span>
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        aria-live="polite"
        className="rounded-xl bg-stone-50 border border-stone-200 p-4 text-sm"
      >
        <p className="font-semibold text-stone-800">
          {s.corners[active.id]}{' '}
          <span className="font-normal text-stone-500">
            ({s.opposite} {s.corners[active.opposite]})
          </span>
        </p>
        <p lang="bua" className="font-buryat text-buryat-700 text-base mt-1">
          {active.example.buryad}
        </p>
        <p className="italic text-stone-600">'{gloss(active.example.translation, lang)}'</p>
        <p className="text-xs text-stone-500 mt-1">{active.example.source}</p>
      </div>

      <p className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-800">
        {s.warning}
      </p>
    </div>
  );
}
