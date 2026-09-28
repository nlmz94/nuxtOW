import type { UseFetchOptions } from '#app'

export function createApiClient() {
  const { apiBase } = useRuntimeConfig().public

  return $fetch.create({
    baseURL: apiBase,
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
}

export function useApiData<T>(url: string | (() => string), options: UseFetchOptions<T> = {}) {
  const { apiBase } = useRuntimeConfig().public

  return useFetch(url, {
    baseURL: apiBase,
    credentials: 'include',
    ...options,
  })
}
