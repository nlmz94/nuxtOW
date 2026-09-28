import type { User } from '~/utils/types'

export function useAuth() {
  const api = createApiClient()
  const user = useState<User | null>('auth:user', () => null)
  const ready = useState<boolean>('auth:ready', () => false)

  /** Loads the current user from the session cookie; null when signed out. */
  async function fetchUser() {
    try {
      const res = await api<{ data: User }>('/me')
      user.value = res.data
    }
    catch {
      user.value = null
    }
    finally {
      ready.value = true
    }
  }

  async function login(email: string, password: string, rememberMe = false) {
    const res = await api<{ data: User }>('/auth/login', {
      method: 'POST',
      body: { email, password, _remember_me: rememberMe },
    })
    user.value = res.data
    return res.data
  }

  async function register(email: string, password: string) {
    const res = await api<{ data: User }>('/auth/register', {
      method: 'POST',
      body: { email, password },
    })
    return res.data
  }

  async function logout() {
    try {
      await api('/auth/logout', { method: 'POST' })
    }
    finally {
      user.value = null
    }
  }

  return { user, ready, fetchUser, login, register, logout }
}
