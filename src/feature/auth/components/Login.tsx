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
import { ArrowRight } from "lucide-react";
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
    <Card className="rounded-2xl shadow-xl p-10 w-full max-w-md">
      <CardHeader className="text-center space-y-8">
        <CardTitle className="text-3xl font-semibold text-heading-color">
          Welcome 👋
        </CardTitle>

        <CardDescription className="text-muted-foreground">
          Find transport services or offer your vehicle for logistics. Join
          network of industrial vitality.{" "}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-text-color">
              Mobile Number
            </Label>

            <div className="flex">
              <div className="flex items-center px-3 bg-common-bg border border-gray-300 rounded-l-lg">
                <span className="text-gray-700 font-medium">+91</span>
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 rounded-l-none rounded-r-lg border-l-0 bg-common-bg"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-lg bg-icon-1-color hover:opacity-90 text-white font-medium gap-2"
            disabled={sendOTP.isPending}
          >
            {sendOTP.isPending ? "Requesting..." : "Request OTP"}
            <ArrowRight />
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  if (!otpSent) {
    return (
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        <LeftHeroSection
          title="Secure Access to Your Account"
          subtitle="Sign in to your account to manage onboarding, track activities, and access your dashboard seamlessly."
          brandLabel="CROPNEST"
          glassText="Security Protocol"
          glassSubText="Your data is encrypted and managed under strict industrial-grade fleet safety standards."
        >
          <LoginCardContent />
        </LeftHeroSection>
        <div className="flex items-center justify-center bg-gray-50 px-6">
          <LoginCardContent />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <LeftHeroSection
        title="Fast & Secure Verification"
        subtitle="Verify your identity to continue securely and access your personalized dashboard."
        brandLabel="CROPNEST"
        glassText="VERIFICATION PROTECTED"
        glassSubText="We ensure safe and authorized access with multi-layer authentication systems."
      >
        <LoginCardContent />
      </LeftHeroSection>
      <div className="flex items-center justify-center bg-gray-50 px-6">
        <OtpVerification phone={phone} />
      </div>
    </div>
  );
};

export default LoginComponent;
