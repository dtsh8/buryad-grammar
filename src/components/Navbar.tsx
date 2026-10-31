import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, ChevronDown } from 'lucide-react';
import { GRAMMAR_SECTIONS, SECTIONS } from '../sections';
import { useI18n } from '../i18n/context';
import LanguageSwitcher from './LanguageSwitcher';

const itemClass = (active: boolean) =>
  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
    active
      ? 'bg-buryat-50 text-buryat-700'
      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
  }`;

// The reference pages behind one button. Closes on navigation, Escape, or a press or focus outside.
function GrammarMenu() {
  const { pathname } = useLocation();
  const { t } = useI18n();
  // The path the menu was opened on: any navigation closes it.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const inGrammar = GRAMMAR_SECTIONS.some(s => pathname.startsWith(s.to));
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPress = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpenedOn(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpenedOn(null);
      button.current?.focus();
    };
    document.addEventListener('pointerdown', onPress);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPress);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      ref={root}
      className="relative"
      onBlur={e => {
        // relatedTarget is null when the window loses focus or a press lands outside any control.
        if (e.relatedTarget && !root.current?.contains(e.relatedTarget)) setOpenedOn(null);
      }}
    >
      <button
        ref={button}
        type="button"
        onClick={() => setOpenedOn(open ? null : pathname)}
        aria-expanded={open}
        aria-controls="grammar-nav-menu"
        className={itemClass(inGrammar || open)}
      >
        <BookOpen size={15} aria-hidden="true" />
        {t.nav.grammar}
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div
          id="grammar-nav-menu"
          className="absolute left-0 top-full mt-2 min-w-48 rounded-xl border border-stone-200 bg-white p-1 shadow-lg space-y-0.5"
        >
          {GRAMMAR_SECTIONS.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpenedOn(null)}
              className={({ isActive }) => itemClass(isActive)}
            >
              <Icon size={15} aria-hidden="true" />
              {t.sections[key].label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

// Top bar. Below lg (phones, tablets) it shows the brand and the language switcher; navigation is the bottom TabBar.
export default function Navbar() {
  const { t } = useI18n();
  const [overview, ...rest] = SECTIONS.filter(s => !s.grammar);

  const link = ({ to, key, icon: Icon }: (typeof SECTIONS)[number]) => (
    <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => itemClass(isActive)}>
      <Icon size={15} aria-hidden="true" />
      {t.sections[key].label}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-14">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2 min-w-0">
            <span lang="bua" className="text-buryat-600 font-bold text-xl font-buryat">
              Буряад
            </span>
            <span className="text-stone-500 text-sm hidden sm:block truncate">
              {t.brandSubtitle}
            </span>
          </NavLink>

          <div className="flex items-center gap-3">
            {/* Desktop nav */}
            <nav aria-label={t.nav.main} className="hidden lg:flex items-center gap-1">
              {link(overview)}
              <GrammarMenu />
              {rest.map(link)}
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
