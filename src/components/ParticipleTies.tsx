import { useI18n } from '../i18n/context';
import type { Messages } from '../i18n/en';
import type { ParticipleTie } from '../utils/phrases';
import { caseName } from '../utils/wordClasses';

function explanation(tie: ParticipleTie, copy: Messages['reader']['ties']): string {
  const { kind, partner = '', participle, noun } = tie;
  return kind === 'open' ? copy.open(noun) : copy[kind](partner, participle, noun);
}

function Part({ word, role, tone }: { word: string; role: string; tone: string }) {
  return (
    <span className={`rounded-lg px-2 py-1 ${tone}`}>
      <span lang="bua" className="block font-buryat text-base text-stone-800">
        {word}
      </span>
      <span className="block text-xs text-stone-500">{role}</span>
    </span>
  );
}

// The words of a participle phrase with their roles, in the order they stand in the sentence.
export default function ParticipleTies({ ties }: { ties: ParticipleTie[] }) {
  const { lang, t } = useI18n();
  const copy = t.reader.ties;
  const partnerRole = { object: 'object', bareObject: 'maybeObject', doer: 'doer' } as const;

  return (
    <div className="md:col-span-2 space-y-3" aria-live="polite">
      {ties.map(tie => (
        <div key={tie.participle + tie.noun} className="rounded-lg bg-stone-50 p-3 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {tie.partner && tie.kind !== 'open' && (
              <>
                <Part
                  word={tie.partner}
                  role={copy.roles[partnerRole[tie.kind]]}
                  tone="bg-amber-50"
                />
                <span aria-hidden="true" className="text-stone-400">
                  →
                </span>
              </>
            )}
            <Part word={tie.participle} role={copy.roles.participle} tone="bg-sky-50" />
            <span aria-hidden="true" className="text-stone-400">
              →
            </span>
            <Part word={tie.noun} role={copy.roles.noun} tone="bg-buryat-50" />
          </div>
          <p className="text-sm text-stone-700">{explanation(tie, copy)}</p>
          {tie.nounCase && tie.nounCase !== 'nominative' && (
            <p className="text-sm text-stone-700">
              {copy.nounCase(tie.noun, caseName(tie.nounCase, lang))}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
