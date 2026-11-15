import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as authApi from '../api/auth.js'
import * as usersApi from '../api/users.js'
import { setUnauthorizedHandler } from '../api/http.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [flash, setFlash] = useState(null) // сообщение на странице входа («Пароль изменён...»)

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null))
    usersApi
      .getProfile()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const signIn = useCallback(async (credentials) => {
    await authApi.login(credentials)
    setUser(await usersApi.getProfile())
    setFlash(null)
  }, [])

  const signUp = useCallback(async (data) => {
    await authApi.register(data)
    setUser(await usersApi.getProfile())
    setFlash(null)
  }, [])

  const signOut = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      setUser(null)
    }
  }, [])

  /** Завершает сессию на стороне интерфейса (сервер уже очистил куки) и показывает сообщение. */
  const endSession = useCallback((message) => {
    setFlash(message)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, flash, setUser, signIn, signUp, signOut, endSession }),
    [user, loading, flash, signIn, signUp, signOut, endSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)