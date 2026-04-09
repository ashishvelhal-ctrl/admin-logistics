import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useVerifyPromoterUserOtp } from "./usePromoterUsers";
import { useSendOTP } from "@/feature/auth/hooks/useSendOtp";
import { useSuccessMessage } from "@/hooks/useSuccessMessage";
import {
  PENDING_USER_STORAGE_KEY,
  VERIFIED_USER_STORAGE_KEY,
} from "../constants/storageKeys";
import type {
  PendingUserData,
  ExistingUserData,
} from "../types/verification.types";

export function useUserOtpVerification() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/(promoter)/verifyUserOtp" });
  const verifyOtpMutation = useVerifyPromoterUserOtp();
  const sendOTPMutation = useSendOTP();
  const { showSuccess, showError } = useSuccessMessage();

  const [otp, setOtp] = useState("");
  const [, setResendLoading] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [existingUser, setExistingUser] = useState<ExistingUserData | null>(
    null,
  );

  const pendingUser = useMemo(() => {
    if (typeof window === "undefined") return null;

    try {
      const raw = sessionStorage.getItem(PENDING_USER_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as PendingUserData;
    } catch {
      return null;
    }
  }, []);

  const handleResendOtp = async () => {
    const phoneNumber = isExistingUser
      ? existingUser?.phoneNumber
      : pendingUser?.phoneNumber;

    if (!phoneNumber) {
      showError("User details not found. Please add details again.");
      if (isExistingUser) {
        navigate({ to: "/myNetwork" });
      } else {
        navigate({ to: "/addUser" });
      }
      return;
    }

    try {
      setResendLoading(true);
      await sendOTPMutation.mutateAsync({
        phoneNumber,
        hashCode: Math.random().toString(36).slice(2),
      });
      showSuccess("OTP resent successfully");
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Failed to resend OTP",
      );
    } finally {
      setResendLoading(false);
    }
  };

  // Check if this is an existing user verification
  useEffect(() => {
    if (search.phone) {
      setIsExistingUser(true);
      setExistingUser({
        phoneNumber: search.phone,
      });
    }
  }, [search.phone]);

  // Auto-send OTP if resend flag is true and existing user is set
  useEffect(() => {
    if (search.resend && existingUser?.phoneNumber) {
      handleResendOtp();
    }
  }, [search.resend, existingUser?.phoneNumber]);

  const maskedPhone = useMemo(() => {
    const phone = isExistingUser
      ? existingUser?.phoneNumber
      : (pendingUser?.phoneNumber ?? "");
    if (!phone || phone.length < 4) return "+91 XXXXXXXX";
    return `+91 ${phone.slice(0, 2)}XXXXXX${phone.slice(-2)}`;
  }, [pendingUser, existingUser, isExistingUser]);

  const handleVerifyOtp = async () => {
    const phoneNumber = isExistingUser
      ? existingUser?.phoneNumber
      : pendingUser?.phoneNumber;

    if (!phoneNumber) {
      showError("User details not found. Please add details again.");
      if (isExistingUser) {
        navigate({ to: "/myNetwork" });
      } else {
        navigate({ to: "/addUser" });
      }
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      showError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const response = await verifyOtpMutation.mutateAsync({
        phoneNumber,
        otpCode: otp,
      });

      if (isExistingUser) {
        showSuccess("Phone number verified successfully!");
        navigate({ to: "/myNetwork" });
        return;
      }

      sessionStorage.setItem(
        VERIFIED_USER_STORAGE_KEY,
        JSON.stringify(response.data),
      );

      if (pendingUser?.provideLogistics) {
        navigate({ to: "/drivingLicence" });
        return;
      }

      sessionStorage.removeItem(PENDING_USER_STORAGE_KEY);
      navigate({ to: "/dashboardp" });
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Failed to verify OTP",
      );
    }
  };

  return {
    otp,
    setOtp,
    isExistingUser,
    maskedPhone,
    isVerifyPending: verifyOtpMutation.isPending,
    isSendPending: sendOTPMutation.isPending,
    handleResendOtp,
    handleVerifyOtp,
    navigate,
  };
}
