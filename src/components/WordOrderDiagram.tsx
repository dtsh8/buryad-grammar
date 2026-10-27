import { WORD_ORDER_EXAMPLES } from '../data/grammar';

const SLOT_COLORS = [
  'bg-mongol-100 border-mongol-300 text-mongol-900',
  'bg-amber-100 border-amber-300 text-amber-900',
  'bg-green-100 border-green-300 text-green-900',
  'bg-buryat-100 border-buryat-300 text-buryat-900',
];

const SLOT_LABELS = ['S', 'O', 'O₂/Adv', 'V'];
const EN_ORDER = ['S', 'V', 'O'];

export default function WordOrderDiagram() {
  return (
    <div className="space-y-8">
      {/* SOV vs SVO comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">
            Buryad (SOV)
          </p>
          <div className="flex gap-2 items-center">
            {['S', 'O', 'V'].map((slot, i) => (
              <div
                key={slot}
                className={`flex-1 text-center rounded-lg border-2 py-3 font-bold text-lg ${SLOT_COLORS[i === 2 ? 3 : i]}`}
              >
                {slot}
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-stone-500 font-buryat text-center">Би ном уншана</p>
          <p className="text-xs text-stone-400 text-center">I book read</p>
        </div>
        <div className="card">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">
            English (SVO)
          </p>
          <div className="flex gap-2 items-center">
            {EN_ORDER.map(slot => (
              <div
                key={slot}
                className={`flex-1 text-center rounded-lg border-2 py-3 font-bold text-lg ${
                  slot === 'S' ? SLOT_COLORS[0] : slot === 'V' ? SLOT_COLORS[3] : SLOT_COLORS[1]
                }`}
              >
                {slot}
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-stone-500 text-center">I read a book</p>
          <p className="text-xs text-stone-400 text-center">I read book</p>
        </div>
      </div>

      {/* Sentence examples */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">
          Annotated Examples
        </h3>
        {WORD_ORDER_EXAMPLES.map((ex, idx) => (
          <div key={idx} className="card py-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {ex.buryad.map((word, wi) => (
                <div key={wi} className="flex flex-col items-center">
                  <span
                    className={`px-3 py-1.5 rounded-lg border text-sm font-buryat font-medium ${
                      wi === ex.highlight
                        ? SLOT_COLORS[3]
                        : wi === 0
                          ? SLOT_COLORS[0]
                          : wi === 1
                            ? SLOT_COLORS[1]
                            : SLOT_COLORS[2]
                    }`}
                  >
                    {word}
                  </span>
                  <span className="text-xs text-stone-400 mt-0.5">{ex.gloss[wi]}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-stone-600 italic">'{ex.translation}'</p>
          </div>
        ))}
      </div>

      {/* Key rules */}
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          {
            icon: '🔚',
            title: 'Verb always last',
            body: 'The finite verb is always the final element of a clause.',
          },
          {
            icon: '🔀',
            title: 'Flexible middle',
            body: 'Objects, adverbials, and secondary verbs order freely between S and V.',
          },
          {
            icon: '📦',
            title: 'Pre-nominal modifiers',
            body: 'Adjectives, relative clauses, and genitives all precede the noun.',
          },
          {
            icon: '🧭',
            title: 'Postpositions',
            body: 'Buryad uses postpositions (after NP), not prepositions like English.',
          },
        ].map(({ icon, title, body }) => (
          <div
            key={title}
            className="flex gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200"
          >
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="text-sm font-semibold text-stone-800">{title}</p>
              <p className="text-xs text-stone-500 mt-0.5">{body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {SLOT_LABELS.map((label, i) => (
          <span key={label} className={`badge ${SLOT_COLORS[i]} px-2 py-1`}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
