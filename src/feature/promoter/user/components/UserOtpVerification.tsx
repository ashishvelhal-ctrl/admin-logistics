import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Lock } from "lucide-react";
import { useMemo, useState } from "react";

import { useCreatePromoterUser } from "../hooks/usePromoterUsers";
import { createPromoterUserSchema } from "../schema/promoter.schema";

import { SixDigitOtpInput } from "@/components/common/SixDigitOtpInput";
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
          <h1 className="text-2xl md:text-3xl font-semibold text-heading-color">
            Enter OTP
          </h1>
          <p className="text-xs md:text-sm text-inactive-text mt-1">
            Add customer or driver details to get started
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: "/addUser" })}
          className="inline-flex items-center gap-2 text-xs md:text-sm text-icon-text hover:opacity-80 pt-2 md:pt-3"
        >
          <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
          Back to Add New
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
              disabled={createUserMutation.isPending}
              className="w-full h-10 md:h-11 rounded-lg bg-icon-1-color hover:bg-icon-1-color/90 text-white"
            >
              {createUserMutation.isPending ? "Verifying..." : "Verify OTP"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="w-full h-10 md:h-11 rounded-lg border-border-stroke text-icon-text hover:bg-gray-50"
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
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
