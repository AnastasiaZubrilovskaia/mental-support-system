import { useState } from 'react'
import { Link } from 'react-router'
import AuthShell from '../components/AuthShell.jsx'
import { Alert, Button, Field, inputClass } from '../components/ui.jsx'
import { GENDERS } from '../config.js'
import { useAuth } from '../context/AuthContext.jsx'
import { todayIso } from '../utils/dates.js'

const EMPTY = {
  name: '',
  surname: '',
  genderId: '',
  birthday: '',
  email: '',
  password: '',
  confirm: '',
  consent: false,
}

export default function RegisterPage() {
  const { signUp } = useAuth()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const update = (field) => (event) =>
    setForm((prev) => ({
      ...prev,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    }))

  function validate() {
    const result = {}
    if (!form.name.trim()) result.name = 'Укажите имя'
    if (!form.email.trim()) result.email = 'Укажите электронную почту'
    if (form.password.length < 6 || form.password.length > 26) {
      result.password = 'Пароль должен быть от 6 до 26 символов'
    }
    if (form.password !== form.confirm) result.confirm = 'Пароли не совпадают'
    if (!form.consent) result.consent = 'Необходимо согласие на обработку данных'
    return result
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage(null)

    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setLoading(true)
    try {
      await signUp({
        name: form.name.trim(),
        surname: form.surname.trim() || null,
        genderId: form.genderId === '' ? null : Number(form.genderId),
        birthday: form.birthday || null,
        email: form.email.trim(),
        password: form.password,
      })
    } catch (err) {
      setErrors(err.fieldErrors ?? {})
      if (!err.fieldErrors) setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Создать аккаунт"
      subtitle="Это займёт меньше минуты"
      footer={
        <>
          Уже есть аккаунт?{' '}
          <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700">
            Войти
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {message && <Alert tone="error">{message}</Alert>}

        <div className="grid grid-cols-2 gap-4">
          <Field label="Имя" error={errors.name}>
            <input value={form.name} onChange={update('name')} autoComplete="given-name" className={inputClass(errors.name)} />
          </Field>
          <Field label="Фамилия" error={errors.surname}>
            <input value={form.surname} onChange={update('surname')} autoComplete="family-name" className={inputClass(errors.surname)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Пол" error={errors.genderId}>
            <select value={form.genderId} onChange={update('genderId')} className={inputClass(errors.genderId)}>
              <option value="">Не указывать</option>
              {GENDERS.map((gender) => (
                <option key={gender.id} value={gender.id}>
                  {gender.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Дата рождения" error={errors.birthday}>
            <input
              type="date"
              max={todayIso()}
              value={form.birthday}
              onChange={update('birthday')}
              className={inputClass(errors.birthday)}
            />
          </Field>
        </div>

        <Field label="Электронная почта" error={errors.email}>
          <input
            type="email"
            autoComplete="username"
            value={form.email}
            onChange={update('email')}
            placeholder="name@example.com"
            className={inputClass(errors.email)}
          />
        </Field>

        <Field label="Пароль" hint="От 6 до 26 символов" error={errors.password}>
          <input
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={update('password')}
            className={inputClass(errors.password)}
          />
        </Field>

        <Field label="Повторите пароль" error={errors.confirm}>
          <input
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={update('confirm')}
            className={inputClass(errors.confirm)}
          />
        </Field>

        <div>
          <label className="flex items-start gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={update('consent')}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-sky-500"
            />
            <span>Согласен на обработку персональных данных и передачу обезличенных данных в языковую модель</span>
          </label>
          {errors.consent && <p className="mt-1 text-xs text-rose-600">{errors.consent}</p>}
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Зарегистрироваться
        </Button>
      </form>
    </AuthShell>
  )
}