import { CalendarDays, NotebookPen, Watch } from 'lucide-react'
import { TAGLINE } from '../config.js'
import { Link } from 'react-router'
import Logo from './Logo.jsx'

const features = [
  { icon: NotebookPen, text: 'Дневник самочувствия с оценками по шкалам' },
  { icon: Watch, text: 'Показатели часов: сон, пульс, стресс' },
  { icon: CalendarDays, text: 'Нагрузка из календаря и задач' },
]

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-linear-to-br from-sky-400 via-cyan-600 to-indigo-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl" />
        <div className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-indigo-300/25 blur-3xl" />
        <div className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full border border-white/10" />
        <div className="absolute -right-16 -top-16 h-80 w-80 rounded-full border border-white/15" />
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full border border-white/20" />
        <div className="absolute -bottom-40 -left-24 h-[30rem] w-[30rem] rounded-full border border-white/10" />
        <div className="absolute -bottom-24 -left-8 h-80 w-80 rounded-full border border-white/15" />
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-56 w-full text-white/10"
        >
          <path
            fill="currentColor"
            d="M0,192L60,181.3C120,171,240,149,360,154.7C480,160,600,192,720,197.3C840,203,960,181,1080,154.7C1200,128,1320,96,1380,80L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
          <path
            fill="currentColor"
            d="M0,256L80,240C160,224,320,192,480,192C640,192,800,224,960,229.3C1120,235,1280,213,1360,202.7L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            className="opacity-60"
          />
        </svg>

        <Link to="/" className="relative z-10 inline-block">
          <Logo variant="light" size={44} />
        </Link>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold leading-tight">{TAGLINE}</h2>
          <p className="mt-4 max-w-md text-lg text-sky-100">
            Дневник, данные часов и календарь в одном месте, а раз в неделю персональный отчёт с понятными выводами.
          </p>
          <ul className="mt-8 space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sky-50">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                  <Icon className="h-5 w-5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-sm text-sky-100">
          Сервис не ставит диагнозов и не заменяет консультацию специалиста.
        </p>
      </aside>

      <div className="relative flex min-h-screen items-center justify-center px-5 pb-10 pt-24 lg:px-10 lg:py-10">
        <header className="absolute left-5 top-5 lg:hidden">
          <Link to="/">
            <Logo />
          </Link>
        </header>

        <main className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          <p className="mt-2 text-slate-500">{subtitle}</p>
          <div className="mt-8 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-sky-900/5 backdrop-blur-md">
            {children}
          </div>
          <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>
        </main>
      </div>
    </div>
  )
}