import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { House, BookOpen, Dumbbell, Languages, LayoutList } from 'lucide-react';
import { GRAMMAR_SECTIONS } from '../sections';
import { useI18n } from '../i18n/context';

const tabClass = (active: boolean) =>
  `flex flex-col items-center justify-center gap-0.5 min-h-12 pt-1.5 text-[11px] transition-colors ${
    active ? 'text-buryat-700 font-semibold' : 'text-stone-500'
  }`;

// Bottom navigation for phones and tablets: five destinations within thumb reach.
// Desktop keeps the top navbar (lg and up), so this is hidden there.
export default function TabBar() {
  const { pathname } = useLocation();
  const { t } = useI18n();
  // The path the Grammar menu was opened on: any navigation closes it.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const inGrammar = GRAMMAR_SECTIONS.some(s => pathname.startsWith(s.to));

  return (
    <nav
      aria-label={t.nav.main}
      className="lg:hidden fixed inset-x-0 bottom-0 z-50 border-t border-stone-200 bg-white/95 backdrop-blur"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      {open && (
        <div
          id="grammar-menu"
          className="border-b border-stone-200 bg-white px-3 py-2 grid grid-cols-2 gap-1"
        >
          {GRAMMAR_SECTIONS.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium ${
                  isActive ? 'bg-buryat-50 text-buryat-700' : 'text-stone-700'
                }`
              }
            >
              <Icon size={18} aria-hidden="true" />
              {t.sections[key].label}
            </NavLink>
          ))}
        </div>
      )}
      <div className="grid grid-cols-5 px-1">
        <NavLink to="/" end className={({ isActive }) => tabClass(isActive)}>
          <House size={22} aria-hidden="true" />
          {t.nav.today}
        </NavLink>
        <button
          type="button"
          onClick={() => setOpenedOn(open ? null : pathname)}
          aria-expanded={open}
          aria-controls="grammar-menu"
          className={tabClass(inGrammar || open)}
        >
          <BookOpen size={22} aria-hidden="true" />
          {t.nav.grammar}
        </button>
        <NavLink to="/practice" className={({ isActive }) => tabClass(isActive)}>
          <Dumbbell size={22} aria-hidden="true" />
          {t.nav.practice}
        </NavLink>
        <NavLink to="/vocabulary" className={({ isActive }) => tabClass(isActive)}>
          <LayoutList size={22} aria-hidden="true" />
          {t.nav.words}
        </NavLink>
        <NavLink to="/reader" className={({ isActive }) => tabClass(isActive)}>
          <Languages size={22} aria-hidden="true" />
          {t.nav.reader}
        </NavLink>
      </div>
    </nav>
  );
}
