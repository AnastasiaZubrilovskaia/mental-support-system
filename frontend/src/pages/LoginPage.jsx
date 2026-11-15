import { useState } from 'react'
import { Link } from 'react-router'
import AuthShell from '../components/AuthShell.jsx'
import { Alert, Button, Field, inputClass } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPage() {
  const { signIn, flash } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signIn(form)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="С возвращением"
      subtitle="Войдите, чтобы продолжить"
      footer={
        <>
          Нет аккаунта?{' '}
          <Link to="/register" className="font-semibold text-sky-600 hover:text-sky-700">
            Зарегистрироваться
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {flash && <Alert tone="success">{flash}</Alert>}
        {error && !error.fieldErrors && <Alert tone="error">{error.message}</Alert>}

        <Field label="Электронная почта" error={error?.fieldErrors?.email}>
          <input
            type="email"
            autoComplete="username"
            required
            value={form.email}
            onChange={update('email')}
            placeholder="name@example.com"
            className={inputClass(error?.fieldErrors?.email)}
          />
        </Field>

        <Field label="Пароль" error={error?.fieldErrors?.password}>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={update('password')}
            className={inputClass(error?.fieldErrors?.password)}
          />
        </Field>

        <Button type="submit" loading={loading} className="w-full">
          Войти
        </Button>
      </form>
    </AuthShell>
  )
}