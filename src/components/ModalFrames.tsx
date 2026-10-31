import { MODAL_FRAMES, type ModalChipRole, type ModalFrame } from '../data/grammar';
import { gloss } from '../i18n/lang';
import { useI18n } from '../i18n/context';

const ROLE_COLORS: Record<ModalChipRole, string> = {
  subject: 'bg-green-100 border-green-300 text-green-900',
  verb: 'bg-mongol-100 border-mongol-300 text-mongol-900',
  modal: 'bg-amber-100 border-amber-300 text-amber-900',
  ending: 'bg-red-100 border-red-300 text-red-900',
  plain: 'bg-stone-50 border-stone-200 text-stone-800',
};

const ROLES = ['subject', 'verb', 'modal', 'ending'] as const;

function Frame({ frame }: { frame: ModalFrame }) {
  const { lang } = useI18n();
  return (
    <div className="space-y-1.5">
      <div lang="bua" className="flex flex-wrap gap-x-1.5 gap-y-2">
        {frame.words.map(word => (
          <div key={word.buryad} className="flex flex-col items-center">
            <span
              className={`px-2.5 py-1 rounded-lg border text-sm font-buryat font-medium ${ROLE_COLORS[word.role ?? 'plain']}`}
            >
              {word.buryad}
            </span>
            <span lang="en" className="text-xs text-stone-500 font-mono mt-0.5">
              {word.gloss}
            </span>
          </div>
        ))}
      </div>
      <p className="text-sm text-stone-600 italic">
        '{gloss(frame.translation, lang)}'{' '}
        <span className="not-italic text-xs text-stone-500">{frame.source}</span>
      </p>
    </div>
  );
}

// The two patterns side by side, colour-coded by what each word does in the sentence.
export default function ModalFrames() {
  const { t } = useI18n();
  const f = t.modals.frames;
  const families = [
    { id: 'ха', title: f.familyHa, text: f.familyHaText },
    { id: 'жа', title: f.familyZha, text: f.familyZhaText },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-xs">
        {ROLES.map(role => (
          <span key={role} className={`badge ${ROLE_COLORS[role]} px-2 py-1`}>
            {f.roles[role]}
          </span>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {families.map(family => (
          <div key={family.id} className="rounded-xl border border-stone-200 p-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-stone-800 font-buryat">{family.title}</h3>
              <p className="text-sm text-stone-500">{family.text}</p>
            </div>
            {MODAL_FRAMES.filter(m => m.family === family.id).map(frame => (
              <Frame key={frame.translation.english} frame={frame} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
