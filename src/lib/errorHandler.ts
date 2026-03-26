import axios from 'axios'

import { apiErrorSchema } from '@/schema/error'

export function handleApiError(err: unknown): never {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data

    const parsed = apiErrorSchema.safeParse(data)

    if (parsed.success) {
      const { error } = parsed.data
      if (error.type.toUpperCase() === 'AUTH_ERROR') {
        throw new Error(error.message)
      }
      if (error.type.toUpperCase() === 'SERVER_ERROR') {
        throw new Error(error.message)
      }
      throw new Error(error.message || 'Something went wrong.')
    }

    throw new Error('Unexpected server error.')
  }

  throw new Error('Network or unknown error.')
}
