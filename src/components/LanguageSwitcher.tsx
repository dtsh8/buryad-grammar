import { useI18n } from '../i18n/context';
import { LANGS } from '../i18n/lang';

// Segmented БУР / EN / РУС control in the top bar. Each option is labelled in its own language,
// so a reader can find theirs whatever the interface is set to.
export default function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t.switcherLabel}
      className="flex items-center rounded-lg border border-stone-200 bg-stone-50 p-0.5"
    >
      {LANGS.map(({ id, short, name }) => (
        <button
          key={id}
          type="button"
          lang={id}
          title={name}
          aria-label={name}
          aria-pressed={lang === id}
          onClick={() => setLang(id)}
          className={`min-w-10 min-h-8 px-2 rounded-md text-xs font-semibold transition-colors ${
            lang === id
              ? 'bg-white text-buryat-700 shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          {short}
        </button>
      ))}
    </div>
  );
}
