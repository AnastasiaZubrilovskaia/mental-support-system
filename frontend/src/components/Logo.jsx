import { useId } from 'react'
import { APP_NAME } from '../config.js'
import { cx } from './ui.jsx'

/** Знак: градиентная спираль на воде. */
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
          <stop offset="0.52" stopColor="#2563eb" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {variant === 'light' ? (
        <rect width="48" height="48" rx="14" fill="white" fillOpacity="0.2" />
      ) : (
        <rect width="48" height="48" rx="14" fill="#eff6ff" />
      )}
      <path
        d="M24 24c0-3.4 4.5-4.4 6.8-1.8 3 3.4.4 9.1-4.3 10.1-6.8 1.5-12.5-4.4-11.2-11.2 1.5-8 10-12.6 17.5-9.1 8.8 4.1 11.2 15.2 5.1 22.5-6.8 8.1-19.8 7.6-25.8-.9"
        fill="none"
        stroke={variant === 'light' ? 'white' : `url(#${gradientId})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.5"
      />
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