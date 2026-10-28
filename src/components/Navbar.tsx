import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { SECTIONS } from '../sections';

export default function Navbar() {
  const { pathname } = useLocation();
  // The path the mobile menu was opened on: any navigation, including the brand link,
  // closes it.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;

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

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-stone-500 hover:bg-stone-100"
            onClick={() => setOpenedOn(open ? null : pathname)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="md:hidden border-t border-stone-100 bg-white px-4 pb-3 pt-1"
        >
          {SECTIONS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpenedOn(null)}
              className={({ isActive }) =>
                `flex items-center gap-2 py-2.5 px-2 rounded-lg text-sm font-medium ${
                  isActive ? 'text-buryat-700 bg-buryat-50' : 'text-stone-600'
                }`
              }
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
