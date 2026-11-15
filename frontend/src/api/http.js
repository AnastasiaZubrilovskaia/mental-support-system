export class ApiError extends Error {
  constructor(status, message, fieldErrors = null) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

// Для этих адресов при 401 токен не обновляется: там 401 означает «неверные данные» или «уже вышли»
const NO_REFRESH = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout']

let unauthorizedHandler = () => {}

/** Вызывается, когда обновить токен не удалось и сессия закончилась. */
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

let refreshing = null

function refreshTokens() {
  if (!refreshing) {
    refreshing = fetch('/auth/refresh', { method: 'POST' })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshing = null
      })
  }
  return refreshing
}

async function readBody(response) {
  if (response.status === 204) return null
  const type = response.headers.get('content-type') || ''
  return type.includes('application/json') ? response.json() : null
}

export async function request(path, { method = 'GET', body, retry = true } = {}) {
  let response
  try {
    response = await fetch(path, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, 'Нет связи с сервером. Проверьте подключение и повторите попытку.')
  }

  if (response.status === 401 && retry && !NO_REFRESH.includes(path)) {
    if (await refreshTokens()) {
      return request(path, { method, body, retry: false })
    }
    unauthorizedHandler()
  }

  const data = await readBody(response)
  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message || 'Не удалось выполнить запрос',
      data?.fieldErrors ?? null,
    )
  }
  return data
}