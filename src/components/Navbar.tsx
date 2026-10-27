import { NavLink } from 'react-router-dom'
import { BookOpen, Mic, Grid, Code2, GitBranch, LayoutList, Menu, X } from 'lucide-react'
import { useState } from 'react'

const links = [
  { to: '/',           label: 'Overview',   icon: BookOpen  },
  { to: '/phonology',  label: 'Phonology',  icon: Mic       },
  { to: '/cases',      label: 'Cases',      icon: Grid      },
  { to: '/verbs',      label: 'Verbs',      icon: Code2     },
  { to: '/word-order', label: 'Word Order', icon: GitBranch },
  { to: '/vocabulary', label: 'Vocabulary', icon: LayoutList },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-buryat-600 font-bold text-xl font-buryat">Буряад</span>
            <span className="text-stone-400 text-sm hidden sm:block">Grammar Reference</span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => (
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
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-stone-500 hover:bg-stone-100"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-stone-100 bg-white px-4 pb-3 pt-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 py-2.5 px-2 rounded-lg text-sm font-medium ${
                  isActive ? 'text-buryat-700 bg-buryat-50' : 'text-stone-600'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
