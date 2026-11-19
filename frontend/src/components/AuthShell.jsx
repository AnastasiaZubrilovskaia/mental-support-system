import { Link } from 'react-router'
import Logo from './Logo.jsx'

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-linear-to-br from-sky-100 via-blue-50 to-indigo-100">
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-indigo-300/25 blur-3xl" />
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 w-full sm:h-72"
      >
        <path
          fill="#60a5fa"
          fillOpacity="0.16"
          d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,149.3C840,139,960,149,1080,165.3C1200,181,1320,203,1380,213.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        />
        <path
          fill="#3b82f6"
          fillOpacity="0.12"
          d="M0,224L80,208C160,192,320,160,480,165.3C640,171,800,213,960,218.7C1120,224,1280,192,1360,176L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        />
        <path
          fill="#818cf8"
          fillOpacity="0.1"
          d="M0,256L80,245.3C160,235,320,213,480,218.7C640,224,800,256,960,261.3C1120,267,1280,245,1360,234.7L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        />
      </svg>

      <header className="relative z-10 mx-auto flex h-16 max-w-7xl items-center px-5 sm:px-8">
        <Link to="/">
          <Logo size={40} />
        </Link>
      </header>

      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-10">
        <main className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          <p className="mt-2 text-slate-500">{subtitle}</p>
          <div className="mt-8 rounded-2xl border border-white/80 bg-white/85 p-6 shadow-xl shadow-blue-900/10 backdrop-blur-md">
            {children}
          </div>
          <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>
        </main>
      </div>
    </div>
  )
}