import { useMutation } from "@tanstack/react-query";

import { otpVerifyRes } from "../schema/otp";

import { logApiError } from "@/hooks/useApiError";
import { apiClient } from "@/lib/api";
import { handleApiError } from "@/lib/errorHandler";

const verifyOTPFn = async (phone: string, otp: string) => {
  try {
    const res = await apiClient.post("/auth/verify-otp", {
      phoneNumber: phone,
      otpCode: otp,
    });
    try {
      return otpVerifyRes.parse(res);
    } catch (parseError) {
      console.error("OTP verify response parse error:", parseError);
      return res; // Return raw data if parse fails
    }
  } catch (err) {
    logApiError(err);
    handleApiError(err);
  }
};

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: ({
      phoneNumber,
      otpCode,
    }: {
      phoneNumber: string;
      otpCode: string;
    }) => verifyOTPFn(phoneNumber, otpCode),
    mutationKey: ["auth", "verify-otp"],
    retry: false,
    onError: (error) => {
      console.error("Failed to verify OTP:", error);
    },
  });
};
