import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'
import { FullScreenSpinner } from './ui.jsx'

/** Пускает только вошедших. Гостя отправляет на публичный лендинг. */
export function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return <FullScreenSpinner />
  if (!user) return <Navigate to="/" replace />
  return <Outlet />
}

/** Страницы входа и регистрации: вошедшего пользователя отправляет на главную. */
export function GuestRoute() {
  const { user, loading } = useAuth()
  if (loading) return <FullScreenSpinner />
  if (user) return <Navigate to="/dashboard" replace />
  return <Outlet />
}