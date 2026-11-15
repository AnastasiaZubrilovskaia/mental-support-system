import { Navigate, Route, Routes } from 'react-router'
import Layout from './components/Layout.jsx'
import { GuestRoute, ProtectedRoute } from './components/RouteGuards.jsx'
import { FullScreenSpinner } from './components/ui.jsx'
import { useAuth } from './context/AuthContext.jsx'
import DiaryPage from './pages/DiaryPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

/** Гостю показывает лендинг, вошедшего отправляет на панель. */
function RootRoute() {
  const { user, loading } = useAuth()
  if (loading) return <FullScreenSpinner />
  return user ? <Navigate to="/dashboard" replace /> : <LandingPage />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/diary" element={<DiaryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}