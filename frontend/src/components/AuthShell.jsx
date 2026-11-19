import { Link } from 'react-router'
import Logo from './Logo.jsx'
import Waves from './Waves.jsx'

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <Waves className="h-56 sm:h-72" />

      <header className="relative z-10 mx-auto flex h-16 max-w-7xl items-center px-5 sm:px-8">
        <Link to="/">
          <Logo size={40} />
        </Link>
      </header>

      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-10">
        <main className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          <p className="mt-2 text-slate-500">{subtitle}</p>
          <div className="mt-8 rounded-2xl border border-sky-100 bg-white/80 p-6 backdrop-blur-sm">
            {children}
          </div>
          <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>
        </main>
      </div>
    </div>
  )
}