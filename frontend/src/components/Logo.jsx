import { useId } from 'react'
import { APP_NAME } from '../config.js'
import { cx } from './ui.jsx'

/** Знак: круги на воде от опущенной глубиномерной лини. */
export function LogoMark({ size = 36, variant = 'color', className }) {
  const gradientId = `fathom-${useId().replace(/:/g, '')}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label={APP_NAME}
    >
      <defs>
        <linearGradient id={gradientId} x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="0.55" stopColor="#2563eb" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      {variant === 'light' ? (
        <rect width="48" height="48" rx="14" fill="white" fillOpacity="0.2" />
      ) : (
        <rect width="48" height="48" rx="14" fill={`url(#${gradientId})`} />
      )}
      <circle cx="24" cy="24" r="19" stroke="white" strokeOpacity="0.3" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="13" stroke="white" strokeOpacity="0.6" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="7" stroke="white" strokeOpacity="0.95" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="2.6" fill="white" />
    </svg>
  )
}

/** Знак вместе с названием. */
export default function Logo({ variant = 'color', size = 36, className }) {
  return (
    <span className={cx('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={size} variant={variant} />
      <span
        className={cx(
          'text-xl font-bold tracking-tight',
          variant === 'light'
            ? 'text-white'
            : 'bg-linear-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent',
        )}
      >
        {APP_NAME}
      </span>
    </span>
  )
}