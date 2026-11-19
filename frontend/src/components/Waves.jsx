import { cx } from './ui.jsx'

const layers = [
  'M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,149.3C840,139,960,149,1080,165.3C1200,181,1320,203,1380,213.3L1440,224L1440,320L0,320Z',
  'M0,224L80,208C160,192,320,160,480,165.3C640,171,800,213,960,218.7C1120,224,1280,192,1360,176L1440,160L1440,320L0,320Z',
  'M0,256L80,245.3C160,235,320,213,480,218.7C640,224,800,256,960,261.3C1120,267,1280,245,1360,234.7L1440,224L1440,320L0,320Z',
]

const tones = {
  blue: [
    ['#60a5fa', 0.16],
    ['#3b82f6', 0.12],
    ['#818cf8', 0.1],
  ],
  light: [
    ['#ffffff', 0.08],
    ['#ffffff', 0.1],
    ['#ffffff', 0.12],
  ],
}

/** Три слоя волн, как на страницах входа и регистрации. */
export default function Waves({ tone = 'blue', className }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      className={cx('waves pointer-events-none absolute inset-x-0 bottom-0 w-full', className)}
    >
      {layers.map((d, index) => (
        <path key={index} d={d} fill={tones[tone][index][0]} fillOpacity={tones[tone][index][1]} />
      ))}
    </svg>
  )
}

/** Волнистый край полосы-секции. Цвет задаётся через text-*. */
export function WaveEdge({ side = 'top', className }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      className={cx(
        'pointer-events-none absolute inset-x-0 h-8 w-full sm:h-12',
        side === 'top' ? 'bottom-full' : 'top-full rotate-180',
        className,
      )}
    >
      <path
        fill="currentColor"
        d="M0,48V30C120,18,240,8,400,14C560,20,640,38,800,36C960,34,1080,10,1240,8C1340,7,1400,14,1440,20V48Z"
      />
    </svg>
  )
}
