import { Fragment } from 'react';
import { VOWELS, VOWEL_HARMONY_PAIRS } from '../data/grammar';

const HARMONY_COLOR: Record<string, string> = {
  back: 'bg-amber-100 border-amber-300 text-amber-900',
  front: 'bg-mongol-100 border-mongol-300 text-mongol-900',
  neutral: 'bg-stone-100 border-stone-300 text-stone-700',
};

export default function VowelHarmonyChart() {
  const back = VOWELS.filter(v => v.harmony === 'back');
  const front = VOWELS.filter(v => v.harmony === 'front');
  const neutral = VOWELS.filter(v => v.harmony === 'neutral');

  return (
    <div className="space-y-6">
      {/* Harmony pair diagram */}
      <div>
        <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
          Harmonic Pairs
        </h3>
        <div className="flex flex-wrap gap-4 justify-center">
          {VOWEL_HARMONY_PAIRS.map(([b, f]) => (
            <div key={b} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-buryat text-amber-700">{b}</span>
                <span className="text-xs text-stone-500">back</span>
              </div>
              <div className="flex flex-col items-center text-stone-500">
                <span className="text-lg">⇄</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-buryat text-mongol-700">{f}</span>
                <span className="text-xs text-stone-500">front</span>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-buryat text-stone-600">и</span>
              <span className="text-xs text-stone-500">neutral</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vowel chart */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left text-stone-500 font-normal pb-2 pr-4">Group</th>
              <th className="text-center text-stone-500 font-normal pb-2 px-3">Letter</th>
              <th className="text-center text-stone-500 font-normal pb-2 px-3">Long</th>
              <th className="text-center text-stone-500 font-normal pb-2 px-3">IPA</th>
              <th className="text-left text-stone-500 font-normal pb-2 pl-4">Example</th>
            </tr>
          </thead>
          <tbody>
            {[...back, ...front, ...neutral].map((v, i, arr) => {
              const prevGroup = i > 0 ? arr[i - 1].harmony : null;
              return (
                <Fragment key={v.letter}>
                  {prevGroup !== v.harmony && i > 0 && (
                    <tr>
                      <td colSpan={5} className="py-1" />
                    </tr>
                  )}
                  <tr className="border-t border-stone-100">
                    <td className="py-2 pr-4">
                      {prevGroup !== v.harmony || i === 0 ? (
                        <span
                          className={`badge ${
                            v.harmony === 'back'
                              ? 'badge-amber'
                              : v.harmony === 'front'
                                ? 'badge-blue'
                                : ''
                          } capitalize`}
                        >
                          {v.harmony}
                        </span>
                      ) : null}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`inline-flex w-10 h-10 items-center justify-center rounded-lg border text-xl font-buryat font-bold ${HARMONY_COLOR[v.harmony]}`}
                      >
                        {v.letter}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="font-buryat text-stone-600">{v.long}</span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <code className="text-xs bg-stone-100 px-1.5 py-0.5 rounded">/{v.ipa}/</code>
                    </td>
                    <td className="py-2 pl-4">
                      <span className="font-buryat text-buryat-700">{v.example.word}</span>
                      <span className="text-stone-500 ml-2">'{v.example.meaning}'</span>
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Rule box */}
      <div className="rounded-xl bg-gradient-to-r from-amber-50 to-mongol-50 border border-stone-200 p-4">
        <p className="text-sm font-semibold text-stone-700 mb-1">📐 The Harmony Rule</p>
        <p className="text-sm text-stone-600">
          All suffixes in a word must agree in <strong>backness</strong> with the root vowel. If the
          root contains <span className="text-amber-700 font-buryat">а / о / у</span> → use{' '}
          <em>back</em> suffix variants. If it contains{' '}
          <span className="text-mongol-700 font-buryat">э / ө / ү</span> → use <em>front</em>{' '}
          variants.
          <span className="text-stone-500"> И is neutral and does not trigger harmony shift.</span>
        </p>
      </div>
    </div>
  );
}
