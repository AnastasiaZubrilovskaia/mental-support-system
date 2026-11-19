import { House, LogOut, NotebookPen, UserRound } from 'lucide-react'
import {Link, NavLink, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'
import Logo from './Logo.jsx'
import Waves from './Waves.jsx'
import { cx } from './ui.jsx'

const links = [
  { to: '/dashboard', label: 'Главная', icon: House, end: true },
  { to: '/diary', label: 'Дневник', icon: NotebookPen },
  { to: '/profile', label: 'Профиль', icon: UserRound },
]

export default function Layout() {
  const { user, signOut } = useAuth()
  const initial = user.name?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="relative isolate min-h-screen">
      <Waves className="fixed! -z-10 h-48 sm:h-64" />
      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/dashboard">
            <Logo size={34} />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cx(
                    'flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition',
                    isActive ? 'bg-sky-100 text-sky-700' : 'text-slate-600 hover:bg-white/80',
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 text-sm text-slate-600 sm:flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 font-semibold text-sky-700">
                {initial}
              </span>
              {user.name}
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white/80"
              title="Выйти"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-8 md:pb-12">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 border-t border-white/60 bg-white/85 backdrop-blur-md md:hidden">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cx(
                'flex flex-col items-center gap-1 py-2.5 text-xs font-medium',
                isActive ? 'text-sky-600' : 'text-slate-500',
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}