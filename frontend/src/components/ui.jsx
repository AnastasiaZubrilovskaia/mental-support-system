import { Loader2 } from 'lucide-react'

export const cx = (...parts) => parts.filter(Boolean).join(' ')

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  primary:
    'bg-sky-600 text-white hover:bg-sky-700',
  secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  ghost: 'text-slate-600 hover:bg-slate-100',
}

export const buttonClass = (variant = 'primary', className) =>
  cx(buttonBase, variants[variant], className)

export function Button({ variant = 'primary', loading = false, className, children, disabled, ...props }) {
  return (
    <button className={buttonClass(variant, className)} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

export function Card({ className, children }) {
  return (
    <section
      className={cx(
        'rounded-2xl border border-sky-100 bg-white/80 p-6 backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </section>
  )
}

export const inputClass = (invalid) =>
  cx(
    'block w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-hidden transition placeholder:text-slate-400 focus:ring-2',
    invalid
      ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
      : 'border-slate-200 focus:border-sky-400 focus:ring-sky-200',
  )

export function Field({ label, error, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}
    </label>
  )
}

const alertTones = {
  info: 'border-sky-200 bg-sky-50 text-sky-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
}

export function Alert({ tone = 'info', children }) {
  return <div className={cx('rounded-xl border px-4 py-3 text-sm', alertTones[tone])}>{children}</div>
}

export function Spinner({ className }) {
  return <Loader2 className={cx('h-6 w-6 animate-spin text-sky-500', className)} />
}

export function FullScreenSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  )
}