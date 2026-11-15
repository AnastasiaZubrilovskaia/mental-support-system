import { CalendarDays, Moon, NotebookPen, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { listDiary } from '../api/diary.js'
import DiaryChart from '../components/DiaryChart.jsx'
import { Alert, Button, Card, Spinner, cx } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { addDays, formatDay, greeting, todayIso } from '../utils/dates.js'

const metrics = [
  { key: 'mood', label: 'Настроение', bar: 'bg-sky-500' },
  { key: 'fatigue', label: 'Усталость', bar: 'bg-amber-500' },
  { key: 'anxiety', label: 'Тревожность', bar: 'bg-rose-500' },
]

const soon = [
  { icon: Moon, title: 'Сон и стресс', text: 'Графики по данным Samsung Health' },
  { icon: CalendarDays, title: 'Нагрузка', text: 'Встречи, выполненные и просроченные задачи' },
  { icon: Sparkles, title: 'Анализ ИИ', text: 'Еженедельный отчёт с рекомендациями' },
]

export default function HomePage() {
  const { user } = useAuth()
  const today = todayIso()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    listDiary(addDays(today, -13), today)
      .then(setEntries)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [today])

  const todayEntry = entries.find((entry) => entry.date === today)
  const lastWeek = entries.filter((entry) => entry.date >= addDays(today, -6))
  const average = (key) =>
    lastWeek.length ? (lastWeek.reduce((sum, entry) => sum + entry[key], 0) / lastWeek.length).toFixed(1) : '—'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {greeting()}, {user.name}
        </h1>
        <p className="mt-1 text-slate-500">{formatDay(today)}</p>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Сегодня</h2>
              <p className="text-sm text-slate-500">
                {todayEntry ? 'Запись за сегодня уже есть' : 'Как вы себя чувствуете?'}
              </p>
            </div>
            <Link to="/diary">
              <Button>
                <NotebookPen className="h-4 w-4" />
                {todayEntry ? 'Изменить запись' : 'Сделать запись'}
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="mt-8 flex justify-center">
              <Spinner />
            </div>
          ) : todayEntry ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {metrics.map(({ key, label, bar }) => (
                <div key={key}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-slate-600">{label}</span>
                    <span className="font-semibold text-slate-900">{todayEntry[key]}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className={cx('h-2 rounded-full', bar)} style={{ width: `${todayEntry[key] * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-800">
              Оценки по шкалам занимают меньше минуты, но со временем показывают закономерности.
            </p>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Среднее за 7 дней</h2>
          <div className="mt-4 space-y-3">
            {metrics.map(({ key, label, bar }) => (
              <div key={key} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <span className={cx('h-2.5 w-2.5 rounded-full', bar)} />
                  {label}
                </span>
                <span className="text-lg font-semibold text-slate-900">{average(key)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Динамика самочувствия за 14 дней</h2>
        {loading ? (
          <div className="flex h-72 items-center justify-center">
            <Spinner />
          </div>
        ) : entries.length === 0 ? (
          <p className="py-16 text-center text-slate-500">Пока нет записей. Начните с дневника.</p>
        ) : (
          <DiaryChart entries={entries} endDate={today} />
        )}
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {soon.map(({ icon: Icon, title, text }) => (
          <Card key={title} className="border-dashed">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                <Icon className="h-5 w-5" />
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">Скоро</span>
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{text}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}