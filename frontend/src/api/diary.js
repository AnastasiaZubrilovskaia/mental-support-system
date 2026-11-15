import { request } from './http.js'

export function listDiary(from, to) {
  const params = new URLSearchParams()
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  const query = params.toString()
  return request(`/api/diary${query ? `?${query}` : ''}`)
}

export const saveDiary = (date, data) => request(`/api/diary/${date}`, { method: 'PUT', body: data })
export const deleteDiary = (date) => request(`/api/diary/${date}`, { method: 'DELETE' })