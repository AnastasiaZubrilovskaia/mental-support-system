import { request } from './http.js'

export const register = (data) => request('/auth/register', { method: 'POST', body: data })
export const login = (data) => request('/auth/login', { method: 'POST', body: data })
export const logout = () => request('/auth/logout', { method: 'POST' })
export const logoutAll = () => request('/auth/logout-all', { method: 'POST' })
export const listSessions = () => request('/auth/sessions')
export const terminateSession = (id) => request(`/auth/sessions/${id}`, { method: 'DELETE' })