import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, CheckCircle2, ShieldCheck } from "lucide-react";

import drivingLicenceImage from "@/assets/Driving_lic.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DrivingLicence() {
  const navigate = useNavigate();
  const [licenceNumber, setLicenceNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const handleCancel = () => {
    navigate({ to: "/addvehical" });
  };

  const handleContinue = () => {
    navigate({ to: "/verifyDrivingLicence" });
  };

  return (
    <main className="bg-common-bg px-2 sm:pr-4 sm:pl-3 pt-1 pb-4 min-h-full space-y-4 sm:space-y-5">
      <section className="px-2">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-heading-color">
              Verify Your Identity
            </h1>
            <p className="text-xs md:text-sm text-inactive-text mt-1">
              Upload your licence details to provide transport services.
              Verification may take a few minutes or hours.
            </p>
          </div>
        </div>

        <article className="mt-3 md:mt-4 rounded-xl border border-border-stroke bg-white px-4 sm:px-8 py-4 sm:py-5 sm:py-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-2">
              <Label
                htmlFor="licenceNumber"
                className="text-sm font-semibold text-heading-color"
              >
                Driving Licence Number
              </Label>
              <Input
                id="licenceNumber"
                value={licenceNumber}
                onChange={(e) => setLicenceNumber(e.target.value)}
                placeholder="Enter Licence Number"
                className="h-10 md:h-11 bg-[#F8FAF9] border-border-stroke placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="dateOfBirth"
                className="text-sm font-semibold text-heading-color"
              >
                Date Of Birth
              </Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-inactive-text pointer-events-none" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="h-10 md:h-11 bg-[#F8FAF9] border-border-stroke pl-10 text-inactive-text"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-6 flex flex-col-reverse md:flex-row sm:justify-end gap-2 sm:gap-3">
            <Button
              type="button"
              onClick={handleContinue}
              className="h-10 md:h-11 w-full sm:w-auto sm:min-w-52 bg-icon-1-color hover:bg-icon-1-color/90 text-white"
            >
              Continue
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="h-10 md:h-11 w-full sm:w-auto sm:min-w-28 border-border-stroke text-icon-text hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </article>
      </section>

      <section className="px-2">
        <article className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#1f6f60] to-[#2d7f71] text-white px-4 sm:px-7 py-4 sm:py-5 sm:py-8">
          <div className="max-w-2xl space-y-4 relative z-10">
            <ShieldCheck className="w-6 h-6 md:w-7 md:h-7 text-[#d9fff2]" />
            <h2 className="text-lg md:text-xl font-semibold">
              Secure &amp; Quick Verification
            </h2>
            <p className="text-xs md:text-sm text-[#d4f2e9] leading-6 sm:leading-8">
              Upload your driving licence to verify your identity and enable
              full access to platform features. Your information is Secure and
              handled with care.
            </p>
            <div className="space-y-2 pt-1">
              <p className="text-xs tracking-[0.2em] text-[#dbf8ef] uppercase inline-flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
                Your data is secure and encrypted
              </p>
              <p className="text-xs tracking-[0.2em] text-[#dbf8ef] uppercase inline-flex items-center gap-2">
                <CalendarDays className="w-3 h-3 md:w-4 md:h-4" />
                Verification usually takes a few minutes
              </p>
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:flex items-center justify-center">
            <img
              src={drivingLicenceImage}
              alt="Driving Licence"
              className="w-99 h-48 md:h-52 object-cover rounded-xl shadow-2xl"
            />
          </div>
        </article>
      </section>
    </main>
  );
}
