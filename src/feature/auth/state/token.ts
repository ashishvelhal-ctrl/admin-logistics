import { atomWithStorage } from 'jotai/utils'

export type Token = {
  access: string
  refresh: string
}

// Token state management using sessionStorage
const sessionStorageStorage = {
  getItem: (key: string) => {
    const value = sessionStorage.getItem(key)
    return value ? JSON.parse(value) : null
  },
  setItem: (key: string, value: any) => {
    sessionStorage.setItem(key, JSON.stringify(value))
  },
  removeItem: (key: string) => {
    sessionStorage.removeItem(key)
  },
}

export const tokenAtom = atomWithStorage<Token | null>(
  'auth_tokens',
  null,
  sessionStorageStorage,
)
