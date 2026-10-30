import { createContext, useContext } from 'react';
import { en, type Messages } from './en';
import { ru } from './ru';
import { bua } from './bua';
import type { Lang } from './lang';

export const MESSAGES: Record<Lang, Messages> = { bua, en, ru };

export interface I18n {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Messages;
}

// Outside a provider (tests rendering one component) the interface is English.
export const I18nContext = createContext<I18n>({ lang: 'en', setLang: () => {}, t: en });

export function useI18n(): I18n {
  return useContext(I18nContext);
}
