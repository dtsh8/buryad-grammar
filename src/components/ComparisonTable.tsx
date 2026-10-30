import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { COMPARISONS } from '../data/grammar';
import { useI18n } from '../i18n/context';

const LANGUAGES = ['buryad', 'mongolian', 'turkish', 'english'] as const;
type Lang = (typeof LANGUAGES)[number];

const LANG_META: Record<Lang, { color: string; stroke: string }> = {
  buryad: { color: 'rgba(200,133,26,0.25)', stroke: '#c8851a' },
  mongolian: { color: 'rgba(14,136,234,0.18)', stroke: '#0e88ea' },
  turkish: { color: 'rgba(34,197,94,0.18)', stroke: '#16a34a' },
  english: { color: 'rgba(239,68,68,0.15)', stroke: '#dc2626' },
};

// Colours of the three insight boxes, in the order of comparison.insights.
const INSIGHT_COLORS = [
  { box: 'bg-amber-50 border-amber-200', title: 'text-amber-800', text: 'text-amber-700' },
  { box: 'bg-green-50 border-green-200', title: 'text-green-800', text: 'text-green-700' },
  { box: 'bg-red-50 border-red-200', title: 'text-red-800', text: 'text-red-700' },
];

export default function ComparisonTable() {
  const { t } = useI18n();
  const c = t.comparison;

  return (
    <div className="space-y-6">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-stone-200">
              <th className="text-left py-3 pr-4 font-semibold text-stone-700">{c.feature}</th>
              {LANGUAGES.map(l => (
                <th
                  key={l}
                  className="text-center py-3 px-3 font-semibold"
                  style={{ color: LANG_META[l].stroke }}
                >
                  {c.langs[l]}
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
        {c.insights.map(({ title, text }, i) => (
          <div key={title} className={`p-4 rounded-xl border ${INSIGHT_COLORS[i].box}`}>
            <p className={`text-sm font-semibold ${INSIGHT_COLORS[i].title}`}>{title}</p>
            <p className={`text-xs mt-1 ${INSIGHT_COLORS[i].text}`}>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Radar chart showing structural similarity ─────────────────────────────

// Axis names come from the i18n messages under comparison.axes.
const SIMILARITY_DATA = [
  { axis: 'sov', buryad: 5, mongolian: 5, turkish: 5, english: 0 },
  { axis: 'harmony', buryad: 5, mongolian: 5, turkish: 5, english: 0 },
  { axis: 'cases', buryad: 4, mongolian: 5, turkish: 4, english: 1 },
  { axis: 'postpositions', buryad: 5, mongolian: 5, turkish: 5, english: 0 },
  { axis: 'person', buryad: 4, mongolian: 0, turkish: 5, english: 2 },
  { axis: 'agglutination', buryad: 5, mongolian: 5, turkish: 5, english: 1 },
] as const;

export function TypologyRadar() {
  const { t } = useI18n();
  const c = t.comparison;
  const data = SIMILARITY_DATA.map(d => ({ ...d, axis: c.axes[d.axis] }));

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
        {c.radarTitle}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11 }} />
          <Tooltip />
          {LANGUAGES.map(l => (
            <Radar
              key={l}
              name={c.langs[l]}
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
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: LANG_META[l].stroke }}
            />
            {c.langs[l]}
          </span>
        ))}
      </div>
    </div>
  );
}
