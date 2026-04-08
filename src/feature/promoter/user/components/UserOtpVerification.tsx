import { ArrowLeft, Lock } from "lucide-react";

import { SixDigitOtpInput } from "@/components/common/SixDigitOtpInput";
import { Button } from "@/components/ui/button";
import { useUserOtpVerification } from "../hooks/useUserOtpVerification";

export default function UserOtpVerification() {
  const {
    otp,
    setOtp,
    isExistingUser,
    maskedPhone,
    isVerifyPending,
    isSendPending,
    handleResendOtp,
    handleVerifyOtp,
    navigate,
  } = useUserOtpVerification();

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
              disabled={isVerifyPending}
              className="w-full h-10 md:h-11 rounded-lg bg-icon-1-color hover:bg-icon-1-color/90 text-white"
            >
              {isVerifyPending ? "Verifying..." : "Verify OTP"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendOtp}
              disabled={isSendPending}
              className="w-full h-10 md:h-11 rounded-lg border-border-stroke text-icon-text hover:bg-gray-50"
            >
              {isSendPending ? "Sending..." : "Resend OTP"}
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
