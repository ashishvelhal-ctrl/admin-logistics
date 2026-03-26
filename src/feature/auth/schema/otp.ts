import { z } from 'zod'

export const otpSendReq = z.object({
  phone_number: z.string().length(10),
  hash_code: z.string(),
})
export type OtpSendReq = z.infer<typeof otpSendReq>

export const otpSendRes = z.object({
  message: z.string(),
})
export type OtpSendRes = z.infer<typeof otpSendRes>

export const otpVerifyReq = z.object({
  phone_number: z.string().length(10),
  otp_code: z.string().length(6),
})
export type OTPVerifyReq = z.infer<typeof otpVerifyReq>

export const otpVerifyRes = z.object({
  message: z.string(),
  data: z.object({ access_token: z.string(), refresh_token: z.string() }),
})
export type OTPVerifyRes = z.infer<typeof otpVerifyRes>
