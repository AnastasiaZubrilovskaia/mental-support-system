import { Save, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { deleteDiary, listDiary, saveDiary } from '../api/diary.js'
import ScaleSlider from '../components/ScaleSlider.jsx'
import { Alert, Button, Card, Field, Spinner, cx, inputClass } from '../components/ui.jsx'
import { addDays, formatDay, todayIso } from '../utils/dates.js'

const MAX_TEXT = 5000
const DEFAULT_FORM = { mood: 5, fatigue: 5, anxiety: 5, text: '' }

export default function DiaryPage() {
  const today = todayIso()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [date, setDate] = useState(today)
  const [form, setForm] = useState(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    listDiary()
      .then(setEntries)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const current = useMemo(() => entries.find((entry) => entry.date === date), [entries, date])

  // При смене дня или загрузке списка подставляем сохранённую запись (или значения по умолчанию)
  useEffect(() => {
    setForm(
      current
        ? { mood: current.mood, fatigue: current.fatigue, anxiety: current.anxiety, text: current.text ?? '' }
        : DEFAULT_FORM,
    )
  }, [current, date])

  const setField = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }))

  function changeDate(value) {
    if (!value) return
    setDate(value)
    setMessage(null)
  }

  async function handleSave(event) {
    event.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const saved = await saveDiary(date, {
        mood: form.mood,
        fatigue: form.fatigue,
        anxiety: form.anxiety,
        text: form.text.trim() || null,
      })
      setEntries((prev) =>
        [saved, ...prev.filter((entry) => entry.date !== saved.date)].sort((a, b) => b.date.localeCompare(a.date)),
      )
      setMessage({ tone: 'success', text: 'Запись сохранена' })
    } catch (err) {
      const details = err.fieldErrors ? Object.values(err.fieldErrors).join('. ') : err.message
      setMessage({ tone: 'error', text: details })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setSaving(true)
    setMessage(null)
    try {
      await deleteDiary(date)
      setEntries((prev) => prev.filter((entry) => entry.date !== date))
      setMessage({ tone: 'success', text: 'Запись удалена' })
    } catch (err) {
      setMessage({ tone: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Дневник</h1>
        <p className="mt-1 text-slate-500">Оцените состояние по шкалам и при желании опишите день</p>
      </div>

      {loadError && <Alert tone="error">{loadError}</Alert>}

      <div className="grid min-w-0 gap-6 lg:grid-cols-5">
        <Card className="min-w-0 p-4 sm:p-6 lg:col-span-3">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex flex-wrap items-end gap-3">
              <div className="w-48">
                <Field label="День">
                  <input
                    type="date"
                    max={today}
                    value={date}
                    onChange={(event) => changeDate(event.target.value)}
                    className={inputClass(false)}
                  />
                </Field>
              </div>
              <Button type="button" variant="secondary" onClick={() => changeDate(today)}>
                Сегодня
              </Button>
              <Button type="button" variant="secondary" onClick={() => changeDate(addDays(today, -1))}>
                Вчера
              </Button>
            </div>

            <p className="text-sm text-slate-500">
              {current ? `Запись за ${formatDay(date)}: можно изменить` : `Новая запись за ${formatDay(date)}`}
            </p>

            <div className="space-y-6">
              <ScaleSlider
                label="Настроение"
                low="Очень плохое"
                high="Отличное"
                tone="sky"
                value={form.mood}
                onChange={setField('mood')}
              />
              <ScaleSlider
                label="Усталость"
                low="Бодр"
                high="Совсем без сил"
                tone="amber"
                value={form.fatigue}
                onChange={setField('fatigue')}
              />
              <ScaleSlider
                label="Тревожность"
                low="Спокоен"
                high="Сильная тревога"
                tone="rose"
                value={form.anxiety}
                onChange={setField('anxiety')}
              />
            </div>

            <Field label="Как прошёл день">
              <textarea
                rows={6}
                maxLength={MAX_TEXT}
                value={form.text}
                onChange={(event) => setField('text')(event.target.value)}
                placeholder="Что произошло, что повлияло на самочувствие. Необязательно."
                className={cx(inputClass(false), 'resize-y')}
              />
              <span className="mt-1 block text-right text-xs text-slate-400">
                {form.text.length} / {MAX_TEXT}
              </span>
            </Field>

            {message && <Alert tone={message.tone}>{message.text}</Alert>}

            <div className="flex flex-wrap gap-3">
              <Button type="submit" loading={saving}>
                <Save className="h-4 w-4" />
                Сохранить
              </Button>
              {current && (
                <Button type="button" variant="secondary" onClick={handleDelete} disabled={saving}>
                  <Trash2 className="h-4 w-4" />
                  Удалить
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card className="min-w-0 p-4 sm:p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">История</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : entries.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">Записей пока нет</p>
          ) : (
            <ul className="mt-4 max-h-136 space-y-2 overflow-y-auto pr-1">
              {entries.map((entry) => (
                <li key={entry.date}>
                  <button
                    type="button"
                    onClick={() => changeDate(entry.date)}
                    className={cx(
                      'w-full min-w-0 rounded-xl border px-3 py-3 text-left transition sm:px-4',
                      entry.date === date
                        ? 'border-sky-300 bg-sky-50'
                        : 'border-slate-100 bg-white hover:border-sky-200',
                    )}
                  >
                    <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <span className="min-w-0 flex-1 text-sm font-semibold text-slate-800">{formatDay(entry.date)}</span>
                      <span className="flex shrink-0 gap-1.5 text-xs font-semibold">
                        <span className="rounded-md bg-sky-100 px-1.5 py-0.5 text-sky-700" title="Настроение">
                          {entry.mood}
                        </span>
                        <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-amber-700" title="Усталость">
                          {entry.fatigue}
                        </span>
                        <span className="rounded-md bg-rose-100 px-1.5 py-0.5 text-rose-700" title="Тревожность">
                          {entry.anxiety}
                        </span>
                      </span>
                    </div>
                    {entry.text && <p className="mt-1 truncate text-sm text-slate-500">{entry.text}</p>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}