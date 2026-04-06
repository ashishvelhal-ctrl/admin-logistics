import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, Lock } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

import { useVerifyPromoterUserOtp } from "../hooks/usePromoterUsers";
import { useSendOTP } from "@/feature/auth/hooks/useSendOtp";

import { SixDigitOtpInput } from "@/components/common/SixDigitOtpInput";
import { Button } from "@/components/ui/button";
import { toastService } from "@/lib/toast";

interface PendingUserData {
  name: string;
  phoneNumber: string;
  address: string;
  provideLogistics: boolean;
}

interface ExistingUserData {
  phoneNumber: string;
  name?: string;
}

const PENDING_USER_STORAGE_KEY = "promoter_new_user_pending";
const VERIFIED_USER_STORAGE_KEY = "promoter_verified_user";

export default function UserOtpVerification() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/(promoter)/verifyUserOtp" });
  const verifyOtpMutation = useVerifyPromoterUserOtp();
  const sendOTPMutation = useSendOTP();
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
      toastService.error("User details not found. Please add details again.");
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
      toastService.success("OTP resent successfully");
    } catch (error) {
      toastService.error(
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
      toastService.error("User details not found. Please add details again.");
      if (isExistingUser) {
        navigate({ to: "/myNetwork" });
      } else {
        navigate({ to: "/addUser" });
      }
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      toastService.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const response = await verifyOtpMutation.mutateAsync({
        phoneNumber,
        otpCode: otp,
      });

      if (isExistingUser) {
        // For existing users, navigate back to user details after successful verification
        toastService.success("Phone number verified successfully!");
        navigate({ to: "/myNetwork" });
        return;
      }

      // For new users, continue with existing flow
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
      toastService.error(
        error instanceof Error ? error.message : "Failed to verify OTP",
      );
    }
  };

  return (
    <main className="bg-common-bg pr-4 pl-3 pt-1 pb-3 min-h-full">
      <section className="px-2 flex flex-col md:flex-row md:items-start md:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-heading-color">
            Enter OTP
          </h1>
          <p className="text-xs md:text-sm text-inactive-text mt-1">
            {isExistingUser
              ? "Verify existing user phone number"
              : "Add customer or driver details to get started"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (isExistingUser) {
              navigate({ to: "/myNetwork" });
            } else {
              navigate({ to: "/addUser" });
            }
          }}
          className="inline-flex items-center gap-2 text-xs md:text-sm text-icon-text hover:opacity-80 pt-2 md:pt-3"
        >
          <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
          Back to {isExistingUser ? "Network" : "Add New"}
        </button>
      </section>

      <section className="mt-4 mx-2 rounded-xl border border-border-stroke bg-white px-4 py-6 sm:px-8 sm:py-8">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-heading-color">
            Verify Your Phone
          </h2>
          <p className="text-xs md:text-sm text-inactive-text mt-2 md:mt-3">
            Enter the 6-digit OTP sent to {maskedPhone}
          </p>

          <SixDigitOtpInput
            value={otp}
            onChange={setOtp}
            className="flex justify-center gap-1 sm:gap-2 md:gap-3 mt-6 md:mt-8"
            inputClassName="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-100 text-center text-lg font-semibold focus:ring-2 focus:ring-icon-1-color outline-none border border-gray-300"
          />

          <div className="mt-6 md:mt-8 space-y-3">
            <Button
              type="button"
              onClick={handleVerifyOtp}
              disabled={verifyOtpMutation.isPending}
              className="w-full h-10 md:h-11 rounded-lg bg-icon-1-color hover:bg-icon-1-color/90 text-white"
            >
              {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendOtp}
              disabled={sendOTPMutation.isPending}
              className="w-full h-10 md:h-11 rounded-lg border-border-stroke text-icon-text hover:bg-gray-50"
            >
              {sendOTPMutation.isPending ? "Sending..." : "Resend OTP"}
            </Button>
          </div>

          <div className="mt-6 md:mt-8 flex items-center justify-center gap-2 text-xs text-inactive-text">
            <Lock className="w-3 h-3" />
            <span>Secure Verification Environment</span>
          </div>
        </div>
      </section>
    </main>
  );
}
