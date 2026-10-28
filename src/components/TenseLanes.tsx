import type { TenseEntry } from '../data/grammar';

// Timeline scale: -3 is long ago, 0 is now, +2 is the future.
const MIN = -3;
const MAX = 2.6;
const pct = (v: number) => ((v - MIN) / (MAX - MIN)) * 100;
const NOW = pct(0);

// One row per tense: the name on the left, its place in time on the right. The track's shape
// carries the meaning: a dot for one event, a line to NOW when the result still holds, a row of
// dots for a habit, a bar for a stretch of time. A dashed line marks NOW through every row.
export default function TenseLanes({
  tenses,
  selected,
  onSelect,
}: {
  tenses: TenseEntry[];
  selected: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr] sm:grid-cols-[8.5rem_1fr] gap-x-3">
      {/* Axis labels */}
      <div />
      <div className="relative h-5 text-xs font-semibold text-stone-500">
        <span className="absolute left-0">PAST</span>
        <span className="absolute -translate-x-1/2 text-mongol-700" style={{ left: `${NOW}%` }}>
          NOW
        </span>
        <span className="absolute right-0">FUTURE</span>
      </div>

      {tenses.map((te, i) => {
        const on = selected === i;
        const { kind, from, to = from, reachesNow } = te.timeline;
        return (
          <button
            key={te.label}
            type="button"
            onClick={() => onSelect(i)}
            aria-pressed={on}
            className={`col-span-2 grid grid-cols-subgrid items-center rounded-lg text-left transition-colors ${
              on ? 'bg-mongol-50' : 'hover:bg-stone-50'
            }`}
          >
            <span className="px-2 py-1.5 leading-tight">
              <span
                className={`block font-buryat text-sm font-bold ${on ? 'text-mongol-700' : 'text-stone-800'}`}
              >
                {te.suffix.back}
              </span>
              <span className="block text-xs text-stone-500">{te.label}</span>
            </span>

            <span className="relative block h-9" aria-hidden="true">
              {/* faint axis and the NOW line */}
              <span className="absolute inset-x-0 top-1/2 h-px bg-stone-200" />
              <span
                className="absolute inset-y-0 border-l-2 border-dashed border-mongol-300"
                style={{ left: `${NOW}%` }}
              />

              {kind === 'span' && (
                <span
                  className={`absolute top-1/2 -translate-y-1/2 h-2.5 rounded-full ${on ? 'bg-mongol-500' : 'bg-stone-400'}`}
                  style={{ left: `${pct(from)}%`, width: `${pct(to) - pct(from)}%` }}
                />
              )}

              {kind === 'repeated' &&
                Array.from({ length: 6 }, (_, k) => from + ((to - from) * k) / 5).map(x => (
                  <span
                    key={x}
                    className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${on ? 'bg-mongol-500' : 'bg-stone-400'}`}
                    style={{ left: `${pct(x)}%` }}
                  />
                ))}

              {kind === 'point' && (
                <>
                  {reachesNow && (
                    <span
                      className={`absolute top-1/2 -translate-y-1/2 h-0.5 ${on ? 'bg-mongol-400' : 'bg-stone-300'}`}
                      style={{ left: `${pct(from)}%`, width: `${NOW - pct(from)}%` }}
                    />
                  )}
                  <span
                    className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 ${
                      on ? 'bg-mongol-500 border-mongol-600' : 'bg-white border-stone-400'
                    }`}
                    style={{ left: `${pct(from)}%` }}
                  />
                </>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
