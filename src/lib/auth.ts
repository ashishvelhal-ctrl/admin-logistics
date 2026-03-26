import { getDefaultStore } from 'jotai'

import { tokenAtom } from '@/feature/auth/state/token'

// Authentication functions using sessionStorage
export const isAuthenticated = (): boolean => {
  const store = getDefaultStore()
  const token = store.get(tokenAtom)
  return !!token?.access
}

export const getAuthToken = (): string | null => {
  const store = getDefaultStore()
  const token = store.get(tokenAtom)
  return token?.access || null
}

export const logout = (): void => {
  const store = getDefaultStore()
  store.set(tokenAtom, null)
  window.location.href = '/auth/login'
}
