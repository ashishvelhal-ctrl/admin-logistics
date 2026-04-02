import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Lock } from "lucide-react";
import { useMemo, useState } from "react";
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";

import { useCreatePromoterUser } from "../hooks/usePromoterUsers";
import { createPromoterUserSchema } from "../schema/promoter.schema";

import { Button } from "@/components/ui/button";
import { toastService } from "@/lib/toast";

interface PendingUserData {
  name: string;
  phoneNumber: string;
  address: string;
  provideLogistics: boolean;
}

const PENDING_USER_STORAGE_KEY = "promoter_new_user_pending";

export default function UserOtpVerification() {
  const navigate = useNavigate();
  const createUserMutation = useCreatePromoterUser();
  const [otp, setOtp] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

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

  const maskedPhone = useMemo(() => {
    const phone = pendingUser?.phoneNumber ?? "";
    if (!phone || phone.length < 4) return "+91 XXXXXXXX";
    return `+91 ${phone.slice(0, 2)}XXXXXX${phone.slice(-2)}`;
  }, [pendingUser]);

  const handleOtpDigitChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value && !/^\d$/.test(value)) return;

      const next = otp.split("");
      next[index] = value;
      const nextOtp = next.join("").slice(0, 6);
      setOtp(nextOtp);

      if (value && index < 5) {
        const nextInput = e.currentTarget
          .nextElementSibling as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    };

  const handleOtpKeyDown =
    (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Backspace") return;

      if (otp[index]) {
        const next = otp.split("");
        next[index] = "";
        setOtp(next.join("").slice(0, 6));
      } else if (index > 0) {
        const prevInput = e.currentTarget
          .previousElementSibling as HTMLInputElement;
        if (prevInput) prevInput.focus();
      }
    };

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (digits.length === 6) setOtp(digits);
  };

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      toastService.success("OTP resent successfully");
    } catch {
      toastService.error("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!pendingUser) {
      toastService.error("User details not found. Please add details again.");
      navigate({ to: "/addUser" });
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      toastService.error("Please enter a valid 6-digit OTP");
      return;
    }

    const validatedData = createPromoterUserSchema.safeParse({
      name: pendingUser.name,
      phoneNumber: pendingUser.phoneNumber,
      address: pendingUser.address,
    });

    if (!validatedData.success) {
      toastService.error(
        "User details are invalid. Please review and try again.",
      );
      navigate({ to: "/addUser" });
      return;
    }

    try {
      await createUserMutation.mutateAsync(validatedData.data);
      sessionStorage.removeItem(PENDING_USER_STORAGE_KEY);

      if (pendingUser.provideLogistics) {
        navigate({ to: "/drivingLicence" });
        return;
      }

      navigate({ to: "/dashboardp" });
    } catch {
      toastService.error("Failed to create user. Please try again.");
    }
  };

  return (
    <main className="bg-common-bg pr-4 pl-3 pt-1 pb-3 min-h-full">
      <section className="px-2 flex flex-col md:flex-row md:items-start md:justify-between gap-2">
        <div>
          <h1 className="text-3xl font-semibold text-heading-color">
            Enter OTP
          </h1>
          <p className="text-sm text-inactive-text mt-1">
            Add customer or driver details to get started
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: "/addUser" })}
          className="inline-flex items-center gap-2 text-sm text-icon-text hover:opacity-80 pt-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Add New
        </button>
      </section>

      <section className="mt-4 mx-2 rounded-xl border border-border-stroke bg-white px-4 py-8 sm:px-8">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-semibold text-heading-color">
            Verify Your Phone
          </h2>
          <p className="text-sm text-inactive-text mt-3">
            Enter the 6-digit OTP sent to {maskedPhone}
          </p>

          <div className="flex justify-center gap-2 sm:gap-3 mt-8">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[index] || ""}
                onChange={handleOtpDigitChange(index)}
                onKeyDown={handleOtpKeyDown(index)}
                onPaste={handleOtpPaste}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-gray-100 text-center text-lg font-semibold focus:ring-2 focus:ring-icon-1-color outline-none border border-gray-300"
              />
            ))}
          </div>

          <div className="mt-8 space-y-3">
            <Button
              type="button"
              onClick={handleVerifyOtp}
              disabled={createUserMutation.isPending}
              className="w-full h-11 rounded-lg bg-icon-1-color hover:bg-icon-1-color/90 text-white"
            >
              {createUserMutation.isPending ? "Verifying..." : "Verify OTP"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="w-full h-11 rounded-lg border-border-stroke text-icon-text hover:bg-gray-50"
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-inactive-text">
            <Lock className="w-3 h-3" />
            <span>Secure Verification Environment</span>
          </div>
        </div>
      </section>
    </main>
  );
}
