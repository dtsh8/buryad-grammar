import { NavLink } from 'react-router-dom';
import { SECTIONS } from '../sections';
import { useI18n } from '../i18n/context';
import LanguageSwitcher from './LanguageSwitcher';

// Top bar. Below lg (phones, tablets) it shows the brand and the language switcher; navigation is the bottom TabBar.
export default function Navbar() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-14">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2 min-w-0">
            <span lang="bua" className="text-buryat-600 font-bold text-xl font-buryat">
              Буряад
            </span>
            <span className="text-stone-500 text-sm hidden sm:block lg:hidden xl:block truncate">
              {t.brandSubtitle}
            </span>
          </NavLink>

          <div className="flex items-center gap-3">
            {/* Desktop nav */}
            <nav aria-label={t.nav.main} className="hidden lg:flex items-center gap-1">
              {SECTIONS.map(({ to, key, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-2 xl:px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-buryat-50 text-buryat-700'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`
                  }
                >
                  <Icon size={15} aria-hidden="true" className="hidden xl:block" />
                  {t.sections[key].label}
                </NavLink>
              ))}
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
