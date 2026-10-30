import { QUESTION_EXAMPLES, type QuestionWord } from '../data/grammar';
import { useI18n } from '../i18n/context';

const ROLE_COLORS: Record<NonNullable<QuestionWord['role']> | 'plain', string> = {
  question: 'bg-amber-100 border-amber-300 text-amber-900',
  marker: 'bg-mongol-100 border-mongol-300 text-mongol-900',
  plain: 'bg-stone-50 border-stone-200 text-stone-800',
};

export default function QuestionPatterns() {
  const { t } = useI18n();
  const q = t.wordOrder.questions;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs">
        <span className={`badge ${ROLE_COLORS.question} px-2 py-1`}>{q.questionWord}</span>
        <span className={`badge ${ROLE_COLORS.marker} px-2 py-1`}>{q.marker}</span>
      </div>

      {QUESTION_EXAMPLES.map(ex => (
        <div key={ex.structure} className="card py-4 space-y-2">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-sm font-semibold text-stone-800">{ex.structure}</h3>
            <span className="text-xs text-stone-500 whitespace-nowrap">{q.page(ex.page)}</span>
          </div>
          <div lang="bua" className="flex flex-wrap gap-2">
            {ex.words.map((word, i) => (
              <div key={i} className="flex flex-col items-center">
                <span
                  className={`px-3 py-1.5 rounded-lg border text-sm font-buryat font-medium ${ROLE_COLORS[word.role ?? 'plain']}`}
                >
                  {word.buryad}
                </span>
                <span lang="en" className="text-xs text-stone-500 font-mono mt-0.5">
                  {word.gloss}
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm text-stone-600 italic">'{ex.translation}'</p>
          <p className="text-sm text-stone-500">{ex.note}</p>
        </div>
      ))}

      <p className="text-xs text-stone-500">{q.glossKey}</p>
      <p className="text-xs text-stone-500">{q.source}</p>
    </div>
  );
}
