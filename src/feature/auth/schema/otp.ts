import { z } from "zod";

export const otpSendReq = z.object({
  phoneNumber: z
    .string()
    .max(10)
    .regex(/[6789]\d{9}$/),
  hashCode: z.string(),
});
export type OtpSendReq = z.infer<typeof otpSendReq>;

export const otpSendRes = z.object({
  message: z.string(),
});
export type OtpSendRes = z.infer<typeof otpSendRes>;

export const otpVerifyReq = z.object({
  phoneNumber: z
    .string()
    .max(10)
    .regex(/[6789]\d{9}$/),
  otpCode: z.string().length(6),
});
export type OTPVerifyReq = z.infer<typeof otpVerifyReq>;

export const otpVerifyRes = z.object({
  message: z.string(),
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    isNewUser: z.boolean().optional(),
    profileStatus: z.string().optional(),
    requiresProfileCompletion: z.boolean().optional(),
  }),
});
export type OTPVerifyRes = z.infer<typeof otpVerifyRes>;
