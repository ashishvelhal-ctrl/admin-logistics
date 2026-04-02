import { useState } from "react";
import { useSendOTP } from "../hooks/useSendOtp";
import { OtpVerification } from "./OtpVerification";
import { LeftHeroSection } from "./LeftHeroSection";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
//Add global css colors after the Confirmation

export const LoginComponent = () => {
  const sendOTP = useSendOTP();

  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone) return;

    setError("");

    sendOTP.mutate(
      {
        phoneNumber: phone,
        hashCode: Math.random().toString(36).slice(2),
      },
      {
        onSuccess: () => setOtpSent(true),
        onError: () => setError("Failed to send OTP"),
      },
    );
  };

  const LoginCardContent = () => (
    <Card className="rounded-lg shadow-xl p-5 md:p-10 w-full max-w-md border-none">
      <CardHeader className="text-left space-y-4 md:space-y-8 px-0">
        <CardTitle className="text-3xl md:text-3xl font-semibold text-heading-color">
          Welcome 👋
        </CardTitle>

        <CardDescription className="text-muted-foreground text-sm md:text-base">
          Find transport services or offer your vehicle for logistics. Join
          network of industrial vitality.{" "}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-8">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-text-color text-xs md:text-sm"
            >
              Mobile Number
            </Label>

            <div className="flex">
              <div className="flex items-center px-3 bg-common-bg border border-gray-300 rounded-l-md">
                <span className="text-gray-700 font-medium text-sm">+91</span>
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="000-000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 rounded-l-none rounded-r-md border-l-0 bg-common-bg text-sm"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-md bg-icon-1-color hover:opacity-90 text-white font-semibold"
            disabled={sendOTP.isPending}
          >
            {sendOTP.isPending ? "Requesting..." : "Request OTP"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  if (!otpSent) {
    return (
      <div className="min-h-screen bg-login-color md:bg-transparent md:grid md:grid-cols-2">
        <LeftHeroSection
          title="Secure Access to Your Account"
          subtitle="Sign in to your account to manage onboarding, track activities, and access your dashboard seamlessly."
          brandLabel="CROPNEST"
          glassText="Security Protocol"
          glassSubText="Your data is encrypted and managed under strict industrial-grade fleet safety standards."
        />
        <div className="px-4 pb-8 md:flex md:items-center md:justify-center md:bg-gray-50 md:px-6">
          <LoginCardContent />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-login-color md:bg-transparent md:grid md:grid-cols-2">
      <LeftHeroSection
        title="Fast & Secure Verification"
        subtitle="Verify your identity to continue securely and access your personalized dashboard."
        brandLabel="CROPNEST"
        glassText="VERIFICATION PROTECTED"
        glassSubText="We ensure safe and authorized access with multi-layer authentication systems."
      />
      <div className="px-4 pb-8 md:flex md:items-center md:justify-center md:bg-gray-50 md:px-6">
        <OtpVerification phone={phone} />
      </div>
    </div>
  );
};

export default LoginComponent;
