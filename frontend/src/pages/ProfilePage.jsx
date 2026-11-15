import { Monitor, Smartphone, Tablet, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { listSessions, logoutAll, terminateSession } from '../api/auth.js'
import { changeEmail, changePassword, deleteAccount, updateProfile } from '../api/users.js'
import { Alert, Button, Card, Field, Spinner, inputClass } from '../components/ui.jsx'
import { GENDERS } from '../config.js'
import { useAuth } from '../context/AuthContext.jsx'
import { formatDateTime, todayIso } from '../utils/dates.js'

const deviceIcons = { desktop: Monitor, mobile: Smartphone, tablet: Tablet }

/** Показывает результат отправки формы: успех или ошибка. */
function Notice({ notice }) {
  if (!notice) return null
  return <Alert tone={notice.tone}>{notice.text}</Alert>
}

const errorText = (err) => (err.fieldErrors ? Object.values(err.fieldErrors).join('. ') : err.message)

function ProfileForm() {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({
    name: user.name ?? '',
    surname: user.surname ?? '',
    genderId: user.genderId ?? '',
    birthday: user.birthday ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState(null)

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))
  // Сервер не умеет очищать пол и дату рождения, только заменять, поэтому пустое значение пропускаем
  const genderOptions = user.genderId ? GENDERS : [{ id: '', label: 'Не указан' }, ...GENDERS]

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setNotice(null)
    try {
      const updated = await updateProfile({
        name: form.name,
        surname: form.surname,
        genderId: form.genderId === '' ? null : Number(form.genderId),
        birthday: form.birthday || null,
      })
      setUser(updated)
      setNotice({ tone: 'success', text: 'Профиль обновлён' })
    } catch (err) {
      setNotice({ tone: 'error', text: errorText(err) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900">Личные данные</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Имя">
            <input value={form.name} onChange={update('name')} className={inputClass(false)} />
          </Field>
          <Field label="Фамилия">
            <input value={form.surname} onChange={update('surname')} className={inputClass(false)} />
          </Field>
          <Field label="Пол">
            <select value={form.genderId} onChange={update('genderId')} className={inputClass(false)}>
              {genderOptions.map((gender) => (
                <option key={gender.id} value={gender.id}>
                  {gender.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Дата рождения">
            <input
              type="date"
              max={todayIso()}
              value={form.birthday}
              onChange={update('birthday')}
              className={inputClass(false)}
            />
          </Field>
        </div>
        <Notice notice={notice} />
        <Button type="submit" loading={saving}>
          Сохранить
        </Button>
      </form>
    </Card>
  )
}

function EmailForm() {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({ newEmail: '', password: '' })
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState(null)

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setNotice(null)
    try {
      setUser(await changeEmail(form))
      setForm({ newEmail: '', password: '' })
      setNotice({ tone: 'success', text: 'Почта изменена' })
    } catch (err) {
      setNotice({ tone: 'error', text: errorText(err) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900">Электронная почта</h2>
      <p className="mt-1 text-sm text-slate-500">
        Сейчас: <span className="font-medium text-slate-700">{user.email}</span>. Она же служит логином.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Новая почта">
            <input
              type="email"
              required
              value={form.newEmail}
              onChange={update('newEmail')}
              className={inputClass(false)}
            />
          </Field>
          <Field label="Текущий пароль">
            <input
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={update('password')}
              className={inputClass(false)}
            />
          </Field>
        </div>
        <Notice notice={notice} />
        <Button type="submit" loading={saving}>
          Изменить почту
        </Button>
      </form>
    </Card>
  )
}

function PasswordForm() {
  const { endSession } = useAuth()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState(null)

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  async function handleSubmit(event) {
    event.preventDefault()
    setNotice(null)
    if (form.newPassword !== form.confirm) {
      setNotice({ tone: 'error', text: 'Новые пароли не совпадают' })
      return
    }
    setSaving(true)
    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword })
      // Сервер завершил все сессии, включая эту: нужно войти заново
      endSession('Пароль изменён. Войдите заново с новым паролем.')
    } catch (err) {
      setNotice({ tone: 'error', text: errorText(err) })
      setSaving(false)
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900">Пароль</h2>
      <p className="mt-1 text-sm text-slate-500">После смены пароля вы выйдете на всех устройствах.</p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Текущий пароль">
            <input
              type="password"
              required
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={update('currentPassword')}
              className={inputClass(false)}
            />
          </Field>
          <Field label="Новый пароль" hint="От 6 до 26 символов">
            <input
              type="password"
              required
              autoComplete="new-password"
              value={form.newPassword}
              onChange={update('newPassword')}
              className={inputClass(false)}
            />
          </Field>
          <Field label="Повторите новый">
            <input
              type="password"
              required
              autoComplete="new-password"
              value={form.confirm}
              onChange={update('confirm')}
              className={inputClass(false)}
            />
          </Field>
        </div>
        <Notice notice={notice} />
        <Button type="submit" loading={saving}>
          Сменить пароль
        </Button>
      </form>
    </Card>
  )
}

function SessionsCard() {
  const { endSession } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    listSessions()
      .then(setSessions)
      .catch((err) => setNotice({ tone: 'error', text: err.message }))
      .finally(() => setLoading(false))
  }, [])

  async function handleTerminate(id) {
    try {
      await terminateSession(id)
      setSessions((prev) => prev.filter((session) => session.id !== id))
    } catch (err) {
      setNotice({ tone: 'error', text: err.message })
    }
  }

  async function handleLogoutAll() {
    try {
      await logoutAll()
      endSession('Вы вышли на всех устройствах.')
    } catch (err) {
      setNotice({ tone: 'error', text: err.message })
    }
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Устройства</h2>
          <p className="mt-1 text-sm text-slate-500">Где выполнен вход в ваш аккаунт</p>
        </div>
        <Button variant="secondary" onClick={handleLogoutAll}>
          Выйти везде
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        <Notice notice={notice} />
        {loading ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : (
          sessions.map((session) => {
            const Icon = deviceIcons[session.deviceType] ?? Monitor
            return (
              <div
                key={session.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {session.deviceLabel ?? 'Неизвестное устройство'}
                      {session.current && (
                        <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          это устройство
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">
                      Последняя активность: {session.lastUsedAt ? formatDateTime(session.lastUsedAt) : '—'}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <Button variant="ghost" onClick={() => handleTerminate(session.id)}>
                    Завершить
                  </Button>
                )}
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}

function DeleteCard() {
  const { user, endSession } = useAuth()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [notice, setNotice] = useState(null)

  async function handleDelete() {
    setDeleting(true)
    setNotice(null)
    try {
      await deleteAccount()
      endSession('Аккаунт удалён.')
    } catch (err) {
      setNotice({ tone: 'error', text: err.message })
      setConfirming(false)
      setDeleting(false)
    }
  }

  return (
    <Card className="border-rose-100">
      <h2 className="text-lg font-semibold text-slate-900">Удаление аккаунта</h2>
      <p className="mt-1 text-sm text-slate-500">
        Аккаунт будет удалён без возможности восстановления.
        {user.admin && ' Учётную запись администратора удалить нельзя: сначала нужно снять с неё роль.'}
      </p>
      <div className="mt-4 space-y-3">
        <Notice notice={notice} />
        {confirming ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-rose-700">Вы уверены?</span>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
              Да, удалить
            </Button>
            <Button variant="secondary" onClick={() => setConfirming(false)}>
              Отмена
            </Button>
          </div>
        ) : (
          <Button variant="secondary" onClick={() => setConfirming(true)}>
            Удалить аккаунт
          </Button>
        )}
      </div>
    </Card>
  )
}

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Профиль</h1>
        <p className="mt-1 text-slate-500">
          {user.name} {user.surname ?? ''}
          {user.admin && (
            <span className="ml-2 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
              администратор
            </span>
          )}
        </p>
      </div>
      <ProfileForm />
      <EmailForm />
      <PasswordForm />
      <SessionsCard />
      <DeleteCard />
    </div>
  )
}