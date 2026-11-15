import { cx } from './ui.jsx'

// Названия классов должны быть записаны целиком: Tailwind не видит собранные из кусков
const tones = {
  sky: { accent: 'accent-sky-500', badge: 'bg-sky-100 text-sky-700' },
  amber: { accent: 'accent-amber-500', badge: 'bg-amber-100 text-amber-700' },
  rose: { accent: 'accent-rose-500', badge: 'bg-rose-100 text-rose-700' },
}

export default function ScaleSlider({ label, low, high, value, onChange, tone = 'sky' }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className={cx('min-w-10 rounded-lg px-2 py-0.5 text-center text-sm font-semibold', tones[tone].badge)}>
          {value}
        </span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        step="1"
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
        className={cx('h-2 w-full cursor-pointer', tones[tone].accent)}
      />
      <div className="mt-1 flex justify-between text-xs text-slate-400">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  )
}