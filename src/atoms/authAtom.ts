import { atomWithStorage } from 'jotai/utils'

export interface AuthState {
  token: string | null
  user: string | null
  roles: string[]
}

const sessionStorageOptions = {
  getItem: (key: string): AuthState => {
    try {
      const item = window.sessionStorage.getItem(key)
      if (item) {
        const parsed = JSON.parse(item)
        return {
          token: parsed.token || null,
          user: parsed.user || null,
          roles: parsed.roles || (parsed.role ? [parsed.role] : []),
        }
      }
      return { token: null, user: null, roles: [] }
    } catch {
      return { token: null, user: null, roles: [] }
    }
  },
  setItem: (key: string, value: AuthState) => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore
    }
  },
  removeItem: (key: string) => {
    try {
      window.sessionStorage.removeItem(key)
    } catch {
      // ignore
    }
  },
}

export const authAtom = atomWithStorage<AuthState>(
  'auth',
  { token: null, user: null, roles: [] },
  sessionStorageOptions,
)
