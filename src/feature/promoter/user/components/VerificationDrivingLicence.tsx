import { useNavigate } from "@tanstack/react-router";
import { BadgeCheck, CheckCircle2, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function VerificationDrivingLicence() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate({ to: "/addvehical" });
  };

  return (
    <main className="bg-common-bg pr-4 pl-3 pt-1 pb-4 min-h-full space-y-4">
      <section className="px-2">
        <div className="rounded-lg border-l-4 border-icon-1-color bg-[#edf4f1] px-4 py-3 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-icon-1-color" />
          <p className="text-base font-semibold text-icon-1-color">
            Driving License Verified Successfully
          </p>
        </div>
      </section>

      <section className="px-2 text-center">
        <h1 className="text-2xl font-semibold text-heading-color inline-flex items-center gap-2">
          Verification Successful
          <BadgeCheck className="w-5 h-5 text-icon-1-color" />
        </h1>
        <p className="text-sm text-inactive-text mt-2">
          Your driving license has been verified successfully. Please review
          your details below.
        </p>
      </section>

      <section className="px-2">
        <article className="rounded-xl border border-border-stroke bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Licence Number
              </p>
              <p className="text-2xl font-semibold text-heading-color mt-1">
                UP1420180098765
              </p>
            </div>
            <p className="text-base font-semibold text-icon-1-color inline-flex items-center gap-2">
              <BadgeCheck className="w-5 h-5" />
              Verified
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Name On License
              </p>
              <p className="text-lg font-semibold text-heading-color mt-1">
                Rajesh Santosh Kumar
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Vehicle Class
              </p>
              <p className="text-lg font-semibold text-heading-color mt-1">
                HGMV
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                RTO Name
              </p>
              <p className="text-lg font-semibold text-heading-color mt-1">
                RTO Pune
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="px-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <article className="rounded-xl border border-border-stroke bg-white px-6 py-5">
          <h2 className="text-lg font-semibold text-heading-color">
            Vehicle Details
          </h2>
          <div className="border-t border-border-stroke mt-3 pt-4 grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Date Of Issue
              </p>
              <p className="text-base font-medium text-heading-color mt-1">
                12 Aug 2018
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Expiry Date
              </p>
              <p className="text-base font-medium text-heading-color mt-1">
                12 Aug 2018
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Initial Issue Date
              </p>
              <p className="text-base font-medium text-heading-color mt-1">
                12 Aug 2018
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Manufacturer
              </p>
              <p className="text-base font-medium text-heading-color mt-1">
                Tata Motors
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-border-stroke bg-white px-6 py-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-heading-color">
              Owner Details
            </h2>
          </div>
          <div className="border-t border-border-stroke mt-3 pt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Owner Name
              </p>
              <p className="text-sm font-medium text-heading-color mt-1">
                Rajesh Santosh Kumar
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Address
              </p>
              <p className="text-sm font-medium text-heading-color mt-1 inline-flex items-center gap-1">
                <MapPin className="w-4 h-4 text-inactive-text" />
                Pune, 411014
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="px-2">
        <div className="mt-10 flex justify-end gap-3">
          <Button
            type="button"
            onClick={() => navigate({ to: "/addvehical" })}
            className="h-11 min-w-52 bg-icon-1-color hover:bg-icon-1-color/90 text-white"
          >
            Continue
          </Button>
        </div>
      </section>
    </main>
  );
}
