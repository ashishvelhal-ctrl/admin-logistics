import { BadgeCheck, CheckCircle2, MapPin } from "lucide-react";

export default function VerificationVehical() {
  return (
    <main className="bg-common-bg pr-4 pl-3 pt-1 pb-4 min-h-full space-y-4">
      <section className="px-2">
        <div className="rounded-lg border-l-4 border-icon-1-color bg-[#edf4f1] px-4 py-3 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-icon-1-color" />
          <p className="text-base font-semibold text-icon-1-color">
            Vehicle add and verified Successfully
          </p>
        </div>
      </section>

      <section className="px-2 text-center">
        <h1 className="text-2xl font-semibold text-heading-color inline-flex items-center gap-2">
          Vehicle Verification
          <BadgeCheck className="w-5 h-5 text-icon-1-color" />
        </h1>
        <p className="text-sm text-inactive-text mt-2">
          Your vehicle registration has been successfully verified. Please
          review the details below.
        </p>
      </section>

      <section className="px-2">
        <article className="rounded-xl border border-border-stroke bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Vehicle Number
              </p>
              <p className="text-2xl font-semibold text-heading-color mt-1">
                MH12DJ1718
              </p>
            </div>
            <p className="text-base font-semibold text-icon-1-color inline-flex items-center gap-2">
              <BadgeCheck className="w-5 h-5" />
              Verified
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Model
              </p>
              <p className="text-lg font-semibold text-heading-color mt-1">
                Activa 4G
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Owner
              </p>
              <p className="text-lg font-semibold text-heading-color mt-1">
                Rajesh Santosh Kumar
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
                Vehicle Type
              </p>
              <p className="text-lg font-medium text-heading-color mt-1">
                M-Cycle/Scooter (2WN)
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Model
              </p>
              <p className="text-lg font-medium text-heading-color mt-1">
                Tata LPT 1613
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Fuel Type
              </p>
              <p className="text-lg font-medium text-heading-color mt-1">
                Petrol
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Manufacturer
              </p>
              <p className="text-lg font-medium text-heading-color mt-1">
                Tata Motors
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-border-stroke bg-white px-6 py-5">
          <h2 className="text-lg font-semibold text-heading-color">
            Owner Details
          </h2>
          <div className="border-t border-border-stroke mt-3 pt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Owner Name
              </p>
              <p className="text-lg font-medium text-heading-color mt-1">
                Rajesh Santosh Kumar
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Address
              </p>
              <p className="text-lg font-medium text-heading-color mt-1 inline-flex items-center gap-1">
                <MapPin className="w-4 h-4 text-inactive-text" />
                Pune, 411014
              </p>
            </div>
          </div>
        </article>
        <article className="rounded-xl border border-border-stroke bg-white px-6 py-5">
          <h2 className="text-lg font-semibold text-heading-color">
            Registration Details
          </h2>
          <div className="border-t border-border-stroke mt-3 pt-4 grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Registration Number
              </p>
              <p className="text-lg font-medium text-heading-color mt-1">
                MH12DJ1718
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Date
              </p>
              <p className="text-lg font-medium text-heading-color mt-1">
                16 Oct 2017
              </p>
            </div>
          </div>
        </article>
        <article className="rounded-xl border border-border-stroke bg-white px-6 py-5">
          <h2 className="text-lg font-semibold text-heading-color">
            Insurance Details
          </h2>
          <div className="border-t border-border-stroke mt-3 pt-4 grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Insurance Company
              </p>
              <p className="text-lg font-medium text-heading-color mt-1">
                ICICI Lombard General Insurance
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Policy Number
              </p>
              <p className="text-lg font-medium text-heading-color mt-1">
                TRK987654321
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Valid Till
              </p>
              <p className="text-lg font-medium text-heading-color mt-1">
                25 Dec 2026
              </p>
            </div>
          </div>
        </article>
        <article className="rounded-xl border border-border-stroke bg-white px-6 py-5">
          <h2 className="text-lg font-semibold text-heading-color">
            Validity Details
          </h2>
          <div className="border-t border-border-stroke mt-3 pt-4 grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Fitness Valid Till
              </p>
              <p className="text-lg font-medium text-heading-color mt-1">
                10 Jun 2029
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Tax Paid Till
              </p>
              <p className="text-lg font-medium text-heading-color mt-1">
                10 Jun 2029
              </p>
            </div>
          </div>
        </article>
        <article className="rounded-xl border border-border-stroke bg-white px-6 py-5">
          <h2 className="text-lg font-semibold text-heading-color">
            PUC Details
          </h2>
          <div className="border-t border-border-stroke mt-3 pt-4 grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                PUC Number
              </p>
              <p className="text-lg font-medium text-heading-color mt-1">
                MH1520210001234
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Valid Till
              </p>
              <p className="text-lg font-medium text-heading-color mt-1">
                15 Jan 2027
              </p>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
