import { BadgeCheck, CheckCircle2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import ButtonActions from "@/components/common/ButtonActions";
import DetailSection from "@/components/common/DetailSection";
import FormGrid from "@/components/common/FormGrid";
import PrimaryButton from "@/components/common/PrimaryButton";
import { useVehicleVerificationData } from "../hooks/useVerificationData";

export default function VerificationVehical() {
  const navigate = useNavigate();
  const { verificationData, formatDate } = useVehicleVerificationData();

  if (!verificationData) {
    return (
      <main className="bg-common-bg pr-4 pl-3 pt-1 pb-4 min-h-full space-y-4 sm:space-y-5">
        <section className="px-2">
          <div className="text-center py-10">
            <p className="text-inactive-text">
              No verification data found. Please complete the verification
              process.
            </p>
            <PrimaryButton onClick={() => navigate({ to: "/addvehical" })}>
              Go to Vehicle Verification
            </PrimaryButton>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-common-bg pr-4 pl-3 pt-1 pb-4 min-h-full space-y-4 sm:space-y-5">
      <section className="px-2">
        <div className="rounded-lg border-l-4 border-icon-1-color bg-[#edf4f1] px-4 py-3 flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-icon-1-color" />
          <p className="text-sm md:text-base font-semibold text-icon-1-color">
            Vehicle add and verified Successfully
          </p>
        </div>
      </section>

      <section className="px-2 text-center">
        <h1 className="text-xl md:text-2xl font-semibold text-heading-color inline-flex items-center gap-2">
          Vehicle Verification
          <BadgeCheck className="w-4 h-4 md:w-5 md:h-5 text-icon-1-color" />
        </h1>
        <p className="text-xs md:text-sm text-inactive-text mt-2">
          Your vehicle registration has been successfully verified. Please
          review the details below.
        </p>
      </section>

      <section className="px-2">
        <article className="rounded-xl border border-border-stroke bg-white px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Vehicle Number
              </p>
              <p className="text-lg md:text-2xl font-semibold text-heading-color mt-1">
                {verificationData.data.vehicleNumber}
              </p>
            </div>
            <p className="text-sm md:text-base font-semibold text-icon-1-color inline-flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 md:w-5 md:h-5" />
              {verificationData.data.status}
            </p>
          </div>

          <FormGrid gap="gap-4 sm:gap-6" className="mt-4 sm:mt-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Model
              </p>
              <p className="text-base md:text-lg font-semibold text-heading-color mt-1">
                {verificationData.data.model}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Owner
              </p>
              <p className="text-base md:text-lg font-semibold text-heading-color mt-1">
                {verificationData.data.owner}
              </p>
            </div>
          </FormGrid>
        </article>
      </section>

      <section className="px-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <article className="rounded-xl border border-border-stroke bg-white px-4 sm:px-6 py-4 sm:py-5">
          <h2 className="text-base md:text-lg font-semibold text-heading-color">
            Vehicle Details
          </h2>
          <DetailSection className="grid grid-cols-2 gap-4 sm:gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Vehicle Type
              </p>
              <p className="text-sm md:text-lg font-medium text-heading-color mt-1">
                {verificationData.data.vehicleType}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Model
              </p>
              <p className="text-sm md:text-lg font-medium text-heading-color mt-1">
                {verificationData.data.manufacturerModel}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Fuel Type
              </p>
              <p className="text-sm md:text-lg font-medium text-heading-color mt-1">
                {verificationData.data.fuelType}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Manufacturer
              </p>
              <p className="text-sm md:text-lg font-medium text-heading-color mt-1">
                {verificationData.data.manufacturer}
              </p>
            </div>
          </DetailSection>
        </article>

        <article className="rounded-xl border border-border-stroke bg-white px-4 sm:px-6 py-4 sm:py-5">
          <h2 className="text-base md:text-lg font-semibold text-heading-color">
            Owner Details
          </h2>
          <DetailSection className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Owner Name
              </p>
              <p className="text-sm md:text-lg font-medium text-heading-color mt-1">
                {verificationData.data.owner}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Registration Date
              </p>
              <p className="text-sm md:text-lg font-medium text-heading-color mt-1">
                {formatDate(verificationData.data.registrationDate)}
              </p>
            </div>
          </DetailSection>
        </article>

        <article className="rounded-xl border border-border-stroke bg-white px-4 sm:px-6 py-4 sm:py-5">
          <h2 className="text-base md:text-lg font-semibold text-heading-color">
            Registration Details
          </h2>
          <DetailSection className="grid grid-cols-2 gap-4 sm:gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Registration Number
              </p>
              <p className="text-sm md:text-lg font-medium text-heading-color mt-1">
                {verificationData.data.vehicleNumber}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Registration Valid Till
              </p>
              <p className="text-sm md:text-lg font-medium text-heading-color mt-1">
                {formatDate(verificationData.data.registrationUpto)}
              </p>
            </div>
          </DetailSection>
        </article>

        <article className="rounded-xl border border-border-stroke bg-white px-4 sm:px-6 py-4 sm:py-5">
          <h2 className="text-base md:text-lg font-semibold text-heading-color">
            Insurance Details
          </h2>
          <DetailSection className="grid grid-cols-2 gap-4 sm:gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Insurance Company
              </p>
              <p className="text-sm md:text-lg font-medium text-heading-color mt-1">
                {verificationData.data.insuranceCompany}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Policy Number
              </p>
              <p className="text-sm md:text-lg font-medium text-heading-color mt-1">
                {verificationData.data.insurancePolicyNumber}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Valid Till
              </p>
              <p className="text-sm md:text-lg font-medium text-heading-color mt-1">
                {formatDate(verificationData.data.insuranceValidTill)}
              </p>
            </div>
          </DetailSection>
        </article>

        <article className="rounded-xl border border-border-stroke bg-white px-4 sm:px-6 py-4 sm:py-5">
          <h2 className="text-base md:text-lg font-semibold text-heading-color">
            Validity Details
          </h2>
          <DetailSection className="grid grid-cols-2 gap-4 sm:gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Fitness Valid Till
              </p>
              <p className="text-sm md:text-lg font-medium text-heading-color mt-1">
                {formatDate(verificationData.data.fitnessValidTill)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Tax Valid Till
              </p>
              <p className="text-sm md:text-lg font-medium text-heading-color mt-1">
                {formatDate(verificationData.data.taxValidUpto)}
              </p>
            </div>
          </DetailSection>
        </article>

        <article className="rounded-xl border border-border-stroke bg-white px-4 sm:px-6 py-4 sm:py-5">
          <h2 className="text-base md:text-lg font-semibold text-heading-color">
            PUC Details
          </h2>
          <DetailSection className="grid grid-cols-2 gap-4 sm:gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                PUC Number
              </p>
              <p className="text-lg font-medium text-heading-color mt-1">
                {verificationData.data.pucNumber}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Valid Till
              </p>
              <p className="text-lg font-medium text-heading-color mt-1">
                {formatDate(verificationData.data.pucValidUpto)}
              </p>
            </div>
          </DetailSection>
        </article>
      </section>

      <ButtonActions>
        <PrimaryButton onClick={() => navigate({ to: "/dashboardp" })}>
          Continue to Dashboard
        </PrimaryButton>
      </ButtonActions>
    </main>
  );
}
