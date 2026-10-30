import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { I18nContext, MESSAGES } from './context';
import { loadLang, saveLang, type Lang } from './lang';

// Holds the interface language: remembered in this browser, mirrored on <html lang> so screen
// readers and hyphenation follow it.
export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(loadLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      t: MESSAGES[lang],
      setLang: (next: Lang) => {
        saveLang(next);
        setLangState(next);
      },
    }),
    [lang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
