const pad = (n) => String(n).padStart(2, '0')

export function toIsoDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export const todayIso = () => toIsoDate(new Date())

export function addDays(iso, amount) {
  const date = new Date(`${iso}T00:00:00`)
  date.setDate(date.getDate() + amount)
  return toIsoDate(date)
}

/** «вс, 3 ноября» */
export function formatDay(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  })
}

/** «03.11» для оси графика */
export function formatShort(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
}

export function formatDateTime(instant) {
  return new Date(instant).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function greeting() {
  const hour = new Date().getHours()
  if (hour < 5) return 'Доброй ночи'
  if (hour < 12) return 'Доброе утро'
  if (hour < 18) return 'Добрый день'
  return 'Добрый вечер'
}