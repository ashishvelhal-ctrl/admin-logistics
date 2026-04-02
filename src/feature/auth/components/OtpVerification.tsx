import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useSetAtom } from "jotai/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Lock } from "lucide-react";

import { useVerifyOTP } from "../hooks/useVerifyOtp";
import { tokenAtom } from "../state/token";

import { authAtom } from "@/atoms/authAtom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authApi } from "@/lib/api";
import { toastService } from "@/lib/toast";
//Add global css colors after the Confirmation

const schema = z.object({
  otpCode: z.string().regex(/^\d{6}$/),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/),
});

type FormData = z.infer<typeof schema>;

const allowedRoles = ["admin", "promoter", "banner-manager"];
const adminRoles = [
  "admin",
  "banner-manager",
  "crop-catalogue-manager",
  "asset-catalogue-manager",
  "area-catalogue-manager",
];

interface Props {
  phone: string;
}

export const OtpVerification = ({ phone }: Props) => {
  const [otp, setOtp] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { phoneNumber: phone, otpCode: "" },
  });

  const verifyOTP = useVerifyOTP();
  const setToken = useSetAtom(tokenAtom);
  const setAuth = useSetAtom(authAtom);
  const navigate = useNavigate();

  const resetAuth = () => {
    setToken({ access: "", refresh: "" });
    setAuth({ token: null, user: null, roles: [] });
  };

  const fetchUser = async (tokens: any) => {
    try {
      setToken(tokens);
      const meResponse = await authApi.getMe();
      const user = (meResponse?.data || {}) as {
        roles?: string[];
        role?: string;
        name?: string;
        username?: string;
        phoneNumber?: string;
      };
      const roles = Array.isArray(user?.roles)
        ? user.roles
        : user?.role
          ? [user.role]
          : [];

      if (!roles.some((r: string) => allowedRoles.includes(r))) {
        toastService.error("Unauthorized access");
        resetAuth();
        return;
      }

      setAuth({
        token: tokens.access,
        user: user.name || user.username || user.phoneNumber || phone,
        roles,
      });

      toastService.success("Login successful");
      const hasPromoterRole = roles.includes("promoter");
      const hasAdminRole = roles.some((role: string) =>
        adminRoles.includes(role),
      );
      if (hasPromoterRole) {
        navigate({ to: "/dashboardp" });
        return;
      }

      if (hasAdminRole) {
        navigate({ to: "/dashboard" });
        return;
      }

      toastService.error("Unauthorized access");
      resetAuth();
    } catch {
      toastService.error("Login failed");
      resetAuth();
    }
  };

  const onSubmit = (data: FormData) => {
    verifyOTP.mutate(data, {
      onSuccess: (res: any) =>
        fetchUser({
          access: res.data.accessToken,
          refresh: res.data.refreshToken,
        }),
      onError: () => toastService.error("OTP Verification Failed"),
    });
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch {
      toastService.error("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const maskedPhone = `+91 ${phone.slice(0, 2)}XXXXXX${phone.slice(-2)}`;

  return (
    <Card className="rounded-lg shadow-xl p-5 md:p-10 max-w-md w-full border-none">
      <CardHeader className="text-left space-y-3 md:space-y-8 px-0">
        <CardTitle className="text-3xl md:text-3xl font-semibold text-heading-color">
          Verify Your Phone
        </CardTitle>

        <p className="text-xs md:text-sm text-muted-foreground">
          Enter 6-digit OTP sent to {maskedPhone}
        </p>
      </CardHeader>

      <CardContent className="space-y-4 md:space-y-5 px-0">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 md:space-y-6">
          <div className="flex gap-2 md:gap-3 justify-center">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-10 h-10 md:w-12 md:h-12 rounded-md md:rounded-lg bg-gray-100 text-center text-base md:text-lg font-semibold focus:ring-2 focus:ring-icon-1-color outline-none border border-gray-300"
                value={otp[index] || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d$/.test(value)) {
                    const newOtp =
                      otp.slice(0, index) + value + otp.slice(index + 1);
                    setOtp(newOtp);
                    form.setValue("otpCode", newOtp);
                    if (value && index < 5) {
                      const nextInput = e.currentTarget
                        .nextElementSibling as HTMLInputElement;
                      if (nextInput) nextInput.focus();
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace") {
                    if (otp[index] && index > 0) {
                      const newOtp = otp.slice(0, index) + otp.slice(index + 1);
                      setOtp(newOtp);
                      form.setValue("otpCode", newOtp);
                    }
                    if (index > 0) {
                      const prevInput = e.currentTarget
                        .previousElementSibling as HTMLInputElement;
                      if (prevInput) prevInput.focus();
                    }
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const pastedData = e.clipboardData.getData("text");
                  const digits = pastedData.replace(/\D/g, "").slice(0, 6);
                  if (digits.length === 6) {
                    setOtp(digits);
                    form.setValue("otpCode", digits);
                  }
                }}
              />
            ))}
          </div>
          <Button
            type="submit"
            className="w-full h-11 md:h-12 rounded-md md:rounded-lg bg-icon-1-color text-white font-semibold hover:opacity-90"
            disabled={verifyOTP.isPending}
          >
            {verifyOTP.isPending ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 rounded-lg bg-green-100 text-green-900 font-medium hover:bg-green-200"
          onClick={handleResend}
          disabled={resendLoading}
        >
          {resendLoading ? "Sending..." : "Resend OTP"}
        </Button>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="w-3 h-3" />
          <span>Secure Verification Environment</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OtpVerification;
