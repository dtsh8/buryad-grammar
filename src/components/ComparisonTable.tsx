import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import { COMPARISONS } from '../data/grammar'

const LANGUAGES = ['buryad', 'mongolian', 'turkish', 'english'] as const
type Lang = typeof LANGUAGES[number]

const LANG_META: Record<Lang, { label: string; color: string; stroke: string }> = {
  buryad:    { label: 'Buryad',    color: 'rgba(200,133,26,0.25)',  stroke: '#c8851a' },
  mongolian: { label: 'Mongolian', color: 'rgba(14,136,234,0.18)',  stroke: '#0e88ea' },
  turkish:   { label: 'Turkish',   color: 'rgba(34,197,94,0.18)',   stroke: '#16a34a' },
  english:   { label: 'English',   color: 'rgba(239,68,68,0.15)',   stroke: '#dc2626' },
}

export default function ComparisonTable() {
  return (
    <div className="space-y-6">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-stone-200">
              <th className="text-left py-3 pr-4 font-semibold text-stone-700">Feature</th>
              {LANGUAGES.map(l => (
                <th key={l} className="text-center py-3 px-3 font-semibold" style={{ color: LANG_META[l].stroke }}>
                  {LANG_META[l].label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISONS.map((row, i) => (
              <tr key={i} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                <td className="py-3 pr-4 text-stone-600 font-medium">{row.feature}</td>
                {LANGUAGES.map(l => (
                  <td key={l} className="py-3 px-3 text-center text-stone-700">
                    {row[l as Lang]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Key insight */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-sm font-semibold text-amber-800">🤝 Buryad ≈ Mongolian</p>
          <p className="text-xs text-amber-700 mt-1">
            Buryad and Mongolian are sister languages — closely related in all structural features. Buryad has preserved more archaic features like the h- in ablative.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-green-50 border border-green-200">
          <p className="text-sm font-semibold text-green-800">🌐 Altaic-type typology</p>
          <p className="text-xs text-green-700 mt-1">
            Like Turkish, Buryad is SOV, agglutinative, with vowel harmony and postpositions — features shared across the proposed "Altaic" typological area.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-sm font-semibold text-red-800">↔️ Opposite to English</p>
          <p className="text-xs text-red-700 mt-1">
            English learners face mirror-image challenges: verb at the end, modifiers before nouns, cases instead of word order, and no articles.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Radar chart showing structural similarity ─────────────────────────────

const SIMILARITY_DATA = [
  { axis: 'SOV order',      buryad: 5, mongolian: 5, turkish: 5, english: 0 },
  { axis: 'Vowel harmony',  buryad: 5, mongolian: 5, turkish: 5, english: 0 },
  { axis: 'Cases',          buryad: 4, mongolian: 5, turkish: 4, english: 1 },
  { axis: 'Postpositions',  buryad: 5, mongolian: 5, turkish: 5, english: 0 },
  { axis: 'Evidentiality',  buryad: 5, mongolian: 4, turkish: 3, english: 0 },
  { axis: 'Agglutination',  buryad: 5, mongolian: 5, turkish: 5, english: 1 },
]

export function TypologyRadar() {
  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Structural Similarity Radar</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={SIMILARITY_DATA}>
          <PolarGrid />
          <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11 }} />
          <Tooltip />
          {LANGUAGES.map(l => (
            <Radar
              key={l}
              name={LANG_META[l].label}
              dataKey={l}
              stroke={LANG_META[l].stroke}
              fill={LANG_META[l].color}
              strokeWidth={2}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-3 mt-2 justify-center">
        {LANGUAGES.map(l => (
          <span key={l} className="flex items-center gap-1.5 text-xs text-stone-600">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: LANG_META[l].stroke }} />
            {LANG_META[l].label}
          </span>
        ))}
      </div>
    </div>
  )
}
