import { NavLink } from 'react-router-dom';
import { SECTIONS } from '../sections';

// Top bar. On phones it shows only the brand; navigation is the bottom TabBar.
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2">
            <span lang="bua" className="text-buryat-600 font-bold text-xl font-buryat">
              Буряад
            </span>
            <span className="text-stone-500 text-sm hidden sm:block">Grammar Reference</span>
          </NavLink>

          {/* Desktop nav */}
          <nav aria-label="Main" className="hidden md:flex items-center gap-1">
            {SECTIONS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-buryat-50 text-buryat-700'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`
                }
              >
                <Icon size={15} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
