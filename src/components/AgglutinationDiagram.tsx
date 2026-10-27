import { AGGLUTINATION_EXAMPLES } from '../data/grammar'

export default function AgglutinationDiagram() {
  return (
    <div className="space-y-8">
      {AGGLUTINATION_EXAMPLES.map((chain, ci) => (
        <div key={ci} className="card">
          <p className="text-xs text-stone-400 uppercase tracking-wide font-semibold mb-4">
            Example {ci + 1}: <span className="normal-case text-stone-600">{chain.gloss}</span>
          </p>
          <div className="overflow-x-auto">
            <div className="flex items-start gap-2 min-w-max">
              {chain.steps.map((step, si) => (
                <div key={si} className="flex items-start gap-2">
                  {/* Step box */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="bg-white border-2 border-stone-200 rounded-xl px-4 py-3 text-center min-w-[110px]">
                        <p className="font-buryat text-lg text-stone-800">{step.form}</p>
                        {step.added !== '∅' && (
                          <p className="text-xs text-buryat-600 font-mono bg-buryat-50 rounded px-1 mt-1">
                            +{step.added}
                          </p>
                        )}
                      </div>
                      {si < chain.steps.length - 1 && (
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 text-stone-300 text-lg z-10">
                          →
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 mt-2 text-center max-w-[120px] leading-tight">
                      {step.meaning}
                    </p>
                  </div>
                  {si < chain.steps.length - 1 && <div className="w-4" />}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-3">
            <span className="text-stone-400 text-sm">Result:</span>
            <span className="font-buryat text-xl text-buryat-700 font-bold">{chain.final}</span>
            <span className="text-stone-500 text-sm">'{chain.translation}'</span>
          </div>
        </div>
      ))}

      <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
        <p className="text-sm font-semibold text-blue-800 mb-1">🧩 Agglutination Principle</p>
        <p className="text-sm text-blue-700">
          Each morpheme carries exactly <strong>one</strong> grammatical meaning. They stack
          linearly:
          <code className="mx-1 bg-blue-100 px-1 rounded">ROOT + PLURAL + CASE + …</code>
          No fusion or irregular forms — Buryad is highly regular in its morphology.
        </p>
      </div>
    </div>
  )
}
