import { useMutation } from "@tanstack/react-query";

import type { OtpSendReq } from "@/feature/auth/schema/otp";

import { otpSendRes } from "@/feature/auth/schema/otp";
import { logApiError } from "@/hooks/useApiError";
import { apiClient } from "@/lib/api";
import { handleApiError } from "@/lib/errorHandler";

const sendOTPFn = async ({ phoneNumber, hashCode }: OtpSendReq) => {
  try {
    const res = await apiClient.post("/auth/login", {
      phoneNumber,
      hashCode,
    });
    try {
      return otpSendRes.parse(res);
    } catch (parseError) {
      console.error("OTP send response parse error:", parseError);
      return res; // Return raw data if parse fails
    }
  } catch (e) {
    logApiError(e);
    handleApiError(e);
  }
};

export const useSendOTP = () => {
  return useMutation({
    mutationFn: (data: OtpSendReq) => sendOTPFn(data),
    mutationKey: ["auth", "send-otp"],
    retry: false,
    onError: (error) => {
      console.error("Failed to send OTP:", error);
    },
  });
};
