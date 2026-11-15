import { request } from './http.js'

export const getProfile = () => request('/users/me')
export const updateProfile = (data) => request('/users/me', { method: 'PATCH', body: data })
export const changeEmail = (data) => request('/users/me/email', { method: 'PUT', body: data })
export const changePassword = (data) => request('/users/me/password', { method: 'PUT', body: data })
export const deleteAccount = () => request('/users/me', { method: 'DELETE' })