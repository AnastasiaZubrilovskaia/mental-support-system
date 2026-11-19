import {
  ArrowRight,
  CalendarDays,
  Check,
  Moon,
  NotebookPen,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Watch,
} from 'lucide-react'
import { Link } from 'react-router'
import Logo from '../components/Logo.jsx'
import { buttonClass, cx } from '../components/ui.jsx'
import { APP_NAME } from '../config.js'

/* ---------- Шапка ---------- */

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/">
          <Logo size={34} />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#how" className="transition hover:text-sky-700">Как это работает</a>
          <a href="#features" className="transition hover:text-sky-700">Возможности</a>
          <a href="#privacy" className="transition hover:text-sky-700">Безопасность</a>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/login" className={buttonClass('ghost')}>Войти</Link>
          <Link to="/register" className={buttonClass('primary')}>Зарегистрироваться</Link>
        </div>
      </div>
    </header>
  )
}

/* ---------- Первый экран ---------- */

function PreviewStat({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3 lg:p-4">
      <span className={cx('flex h-8 w-8 items-center justify-center rounded-lg', tone)}>
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-2 text-xs text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  )
}

/** Иллюстрация интерфейса: данные придуманы и подписаны как пример. */
function HeroPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[2.5rem] bg-linear-to-br from-sky-200/60 via-blue-200/40 to-indigo-200/60 blur-2xl" />

      <div className="relative rounded-3xl border border-white/70 bg-white/85 p-5 shadow-2xl shadow-sky-900/10 backdrop-blur-md lg:p-6 xl:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Ваша неделя</p>
            <p className="text-xs text-slate-400">Пример интерфейса</p>
          </div>
          <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700">7 дней</span>
        </div>

        <svg viewBox="0 0 300 120" className="mt-4 h-40 w-full lg:h-48 xl:h-52" role="img" aria-label="Пример графика самочувствия">
          {[30, 60, 90].map((y) => (
            <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />
          ))}
          <path
            d="M0,70 C30,60 50,40 80,45 S130,80 160,60 S220,30 250,40 S290,35 300,30"
            fill="none" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round"
          />
          <path
            d="M0,40 C30,50 60,75 90,70 S140,35 170,50 S220,85 250,75 S290,60 300,65"
            fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"
          />
          <path
            d="M0,90 C30,85 60,95 90,80 S140,70 170,85 S220,60 250,55 S290,70 300,60"
            fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round"
          />
        </svg>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <PreviewStat icon={Moon} label="Сон" value="6 ч 40 мин" tone="bg-indigo-50 text-indigo-600" />
          <PreviewStat icon={TrendingUp} label="Стресс" value="выше нормы" tone="bg-amber-50 text-amber-600" />
          <PreviewStat icon={CalendarDays} label="Встречи" value="4 ч в день" tone="bg-sky-50 text-sky-600" />
        </div>

        <div className="mt-4 flex gap-3 rounded-2xl bg-linear-to-r from-sky-50 to-indigo-50 p-4 lg:p-5">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
          <p className="text-sm text-slate-700">
            В дни, когда вы спите меньше 6 часов, тревожность выше. Попробуйте ложиться на полчаса раньше.
          </p>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  const points = ['Записи дневника шифруются', 'Без диагнозов и ярлыков', 'Аккаунт можно удалить']

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-16 pt-12 lg:gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:pb-24 lg:pt-20 xl:gap-14">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/70 px-3.5 py-1.5 text-sm font-medium text-sky-700">
            <Sparkles className="h-4 w-4" />
            Дневник, часы и календарь в одном месте
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Разберитесь, что стоит{' '}
            <span className="bg-linear-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              за вашим состоянием
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-slate-600">
            {APP_NAME} собирает самочувствие, данные часов и нагрузку из календаря и показывает, как они связаны.
            Раз в неделю вы получаете понятный отчёт с закономерностями и рекомендациями.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className={buttonClass('primary', 'px-6 py-3 text-base')}>
              Создать аккаунт
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className={buttonClass('secondary', 'px-6 py-3 text-base')}>
              Войти
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <HeroPreview />
      </div>
    </section>
  )
}

/* ---------- Идея ---------- */

const sources = [
  { icon: NotebookPen, title: 'Самочувствие', text: 'Дневник и оценки по шкалам', tone: 'bg-sky-100 text-sky-600' },
  { icon: Watch, title: 'Тело', text: 'Сон, пульс и стресс с часов', tone: 'bg-indigo-100 text-indigo-600' },
  { icon: CalendarDays, title: 'Нагрузка', text: 'Встречи и задачи из календаря', tone: 'bg-amber-100 text-amber-600' },
]

function Idea() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Данные есть, а картины нет</h2>
        <p className="mt-4 text-lg text-slate-600">
          Сон считают часы, встречи висят в календаре, а самочувствие остаётся в голове. Пока всё это лежит порознь,
          трудно заметить, что тревожность растёт после недосыпа, а усталость копится в недели с плотным графиком.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {sources.map(({ icon: Icon, title, text, tone }) => (
          <div key={title} className="rounded-2xl border border-white/70 bg-white/80 p-6 text-center shadow-lg shadow-sky-900/5 backdrop-blur-md">
            <span className={cx('mx-auto flex h-12 w-12 items-center justify-center rounded-2xl', tone)}>
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{text}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-lg font-medium text-sky-700">
        {APP_NAME} складывает их в одну картину
      </p>
    </section>
  )
}

/* ---------- Как это работает ---------- */

const steps = [
  {
    title: 'Записывайте',
    text: 'Раз в день оцените настроение, усталость и тревожность по шкале от 1 до 10 и при желании опишите день. Это занимает меньше минуты.',
  },
  {
    title: 'Подключайте',
    text: 'Загрузите экспорт данных Samsung Health и подключите календарь Google или Яндекс: сон, пульс, стресс и нагрузка будут рядом с вашими оценками.',
  },
  {
    title: 'Получайте выводы',
    text: 'Раз в неделю ИИ готовит отчёт на русском языке: какие закономерности заметны и что можно изменить.',
  },
]

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 bg-white/50 py-16 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-3xl font-bold text-slate-900 sm:text-4xl">Как это работает</h2>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-blue-600 text-xl font-bold text-white shadow-lg shadow-sky-500/30">
                {index + 1}
              </span>
              <h3 className="mt-5 text-xl font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Возможности ---------- */

// soon: true показывает бейдж «Скоро». Когда функция заработает, поставьте false.
const features = [
  {
    icon: NotebookPen,
    title: 'Дневник самочувствия',
    text: 'Шкалы от 1 до 10 и свободный текст. История записей всегда под рукой.',
    soon: false,
  },
  {
    icon: TrendingUp,
    title: 'Динамика на графиках',
    text: 'Настроение, усталость и тревожность по дням: видно, как состояние меняется.',
    soon: false,
  },
  {
    icon: Watch,
    title: 'Данные часов',
    text: 'Сон, пульс, стресс и активность из экспорта Samsung Health.',
    soon: true,
  },
  {
    icon: CalendarDays,
    title: 'Нагрузка из календаря',
    text: 'Длительность встреч, выполненные и просроченные задачи.',
    soon: true,
  },
  {
    icon: Sparkles,
    title: 'Недельный отчёт',
    text: 'Закономерности между сном, нагрузкой и самочувствием и рекомендации на русском языке.',
    soon: true,
  },
  {
    icon: ShieldCheck,
    title: 'Контроль над данными',
    text: 'Шифрование записей, управление устройствами и удаление аккаунта.',
    soon: false,
  },
]

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16">
      <h2 className="text-center text-3xl font-bold text-slate-900 sm:text-4xl">Что внутри</h2>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, text, soon }) => (
          <div
            key={title}
            className={cx(
              'rounded-2xl border bg-white/80 p-6 shadow-lg shadow-sky-900/5 backdrop-blur-md',
              soon ? 'border-dashed border-slate-200' : 'border-white/70',
            )}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                <Icon className="h-5 w-5" />
              </span>
              {soon && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">Скоро</span>
              )}
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------- Безопасность ---------- */

function Privacy() {
  return (
    <section id="privacy" className="scroll-mt-20 bg-white/50 py-16 backdrop-blur-sm">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Ваши данные остаются вашими</h2>
          <p className="mt-4 text-lg text-slate-600">
            Информация о самочувствии личная. Мы храним её так, чтобы никто, кроме вас, не мог её прочитать.
            Администратор сервиса управляет только учётными записями, но не вашими записями в дневнике.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ---------- Финал ---------- */

function FinalCta() {
  return (
    <section className="px-4 py-16">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-linear-to-br from-sky-500 via-blue-600 to-indigo-700 px-8 py-14 text-center text-white shadow-2xl shadow-blue-900/20">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/15" />
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/20" />
        <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full border border-white/15" />

        <div className="relative">
          <h2 className="text-3xl font-bold sm:text-4xl">Начните с одной записи сегодня</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-sky-100">
            Минута в день, а со временем вы увидите, как всё связано.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-blue-700 shadow-lg transition hover:bg-sky-50"
            >
              Создать аккаунт
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-white/40 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Войти
            </Link>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-slate-500">
        {APP_NAME} не заменяет врача или психолога и не ставит диагнозов. Если вам тяжело, пожалуйста,
        обратитесь к специалисту, а в экстренной ситуации звоните 112.
      </p>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/60 bg-white/60 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row">
        <Logo size={28} />
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} {APP_NAME} 
        </p>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Idea />
        <HowItWorks />
        <Features />
        <Privacy />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}