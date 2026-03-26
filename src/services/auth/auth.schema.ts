import { z } from "zod";

export const sendOtpReqSchema = z.object({
  body: z.object({
    phoneNumber: z.string().min(10).max(15),
    hashCode: z.string().min(1),
  }),
});

export const verifyOtpReqSchema = z.object({
  body: z.object({
    phoneNumber: z.string().min(10).max(15),
    otpCode: z.string().min(4).max(6),
  }),
});

export const refreshTokenReqSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1),
  }),
});

export type SendOtpRequest = z.infer<typeof sendOtpReqSchema>;
export type VerifyOtpRequest = z.infer<typeof verifyOtpReqSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenReqSchema>;
