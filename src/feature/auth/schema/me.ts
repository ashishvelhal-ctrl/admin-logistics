import { z } from 'zod'

export const authMeReq = z.object({})
export type AuthMeReq = z.infer<typeof authMeReq>

export const authMeRes = z.object({
  message: z.string(),
  data: z.object({
    id: z.string(),
    phoneNumber: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.union([z.null(), z.string()]),
    isVerified: z.boolean(),
  }),
})
export type AuthMeRes = z.infer<typeof authMeRes>
