import { z } from 'zod'

export const apiErrorSchema = z.object({
  error: z.object({
    type: z.string(),
    message: z.string(),
    code: z.string().optional(),
    timestamp: z.string().optional(),
  }),
})

export type ApiError = z.infer<typeof apiErrorSchema>
