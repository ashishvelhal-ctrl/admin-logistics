import { useNavigate } from "@tanstack/react-router";
import { BadgeCheck, CheckCircle2, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import ButtonActions from "@/components/common/ButtonActions";
import PrimaryButton from "@/components/common/PrimaryButton";

interface DLVerificationData {
  message: string;
  data: {
    licenseNumber: string;
    name: string;
    dob: string;
    state: string;
    dateOfIssue: string;
    dateOfExpiry: string;
    gender: string;
    permanentAddress: string;
    temporaryAddress: string;
    fatherOrHusbandName: string;
    citizenship: string;
    olaName: string;
    olaCode: string;
    clientId: string;
    permanentZip: string;
    cityName: string | null;
    temporaryZip: string;
    transportDateOfExpiry: string;
    transportDateOfIssue: string;
    bloodGroup: string;
    vehicleClasses: string[];
    additionalCheck: any[];
    initialDateOfIssue: string;
    currentStatus: any;
    vehicleClassDescription: any[];
    status: string;
    verificationSource: string;
  };
}

export default function VerificationDrivingLicence() {
  const navigate = useNavigate();
  const [verificationData, setVerificationData] =
    useState<DLVerificationData | null>(null);

  useEffect(() => {
    // Retrieve verification data from session storage
    const storedData = sessionStorage.getItem("dlVerificationData");
    if (storedData) {
      setVerificationData(JSON.parse(storedData));
    }
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "1800-01-01T00:00:00.000Z") return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!verificationData) {
    return (
      <main className="bg-common-bg px-2 sm:pr-4 sm:pl-3 pt-1 pb-4 min-h-full space-y-4">
        <section className="px-2">
          <div className="text-center py-10">
            <p className="text-inactive-text">
              No verification data found. Please complete the verification
              process.
            </p>
            <Button
              onClick={() => navigate({ to: "/drivingLicence" })}
              className="mt-4"
            >
              Go to Verification
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-common-bg px-2 sm:pr-4 sm:pl-3 pt-1 pb-4 min-h-full space-y-4">
      <section className="px-2">
        <div className="rounded-lg border-l-4 border-icon-1-color bg-[#edf4f1] px-4 py-3 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-icon-1-color" />
          <p className="text-sm sm:text-base font-semibold text-icon-1-color">
            Driving License Verified Successfully
          </p>
        </div>
      </section>

      <section className="px-2 text-center">
        <h1 className="text-xl sm:text-2xl font-semibold text-heading-color inline-flex items-center gap-2">
          Verification Successful
          <BadgeCheck className="w-5 h-5 text-icon-1-color" />
        </h1>
        <p className="text-xs sm:text-sm text-inactive-text mt-2">
          Your driving license has been verified successfully. Please review
          your details below.
        </p>
      </section>

      <section className="px-2">
        <article className="rounded-xl border border-border-stroke bg-white px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Licence Number
              </p>
              <p className="text-lg md:text-xl md:text-2xl font-semibold text-heading-color mt-1 break-all">
                {verificationData.data.licenseNumber}
              </p>
            </div>
            <p className="text-xs md:text-sm md:text-base font-semibold text-icon-1-color inline-flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 md:w-5 md:h-5" />
              {verificationData.data.status}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Name On License
              </p>
              <p className="text-sm md:text-base font-semibold text-heading-color mt-1">
                {verificationData.data.name}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Vehicle Class
              </p>
              <p className="text-sm md:text-base font-semibold text-heading-color mt-1">
                {verificationData.data.vehicleClasses.join(", ")}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                RTO Name
              </p>
              <p className="text-sm md:text-base font-semibold text-heading-color mt-1">
                {verificationData.data.olaName}
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="px-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <article className="rounded-xl border border-border-stroke bg-white px-4 sm:px-6 py-4 sm:py-5">
          <h2 className="text-base md:text-lg font-semibold text-heading-color">
            Vehicle Details
          </h2>
          <div className="border-t border-border-stroke mt-3 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Date Of Issue
              </p>
              <p className="text-sm md:text-base font-medium text-heading-color mt-1">
                {formatDate(verificationData.data.dateOfIssue)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Expiry Date
              </p>
              <p className="text-sm md:text-base font-medium text-heading-color mt-1">
                {formatDate(verificationData.data.dateOfExpiry)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Initial Issue Date
              </p>
              <p className="text-sm md:text-base font-medium text-heading-color mt-1">
                {formatDate(verificationData.data.initialDateOfIssue)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                State
              </p>
              <p className="text-sm md:text-base font-medium text-heading-color mt-1">
                {verificationData.data.state}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-border-stroke bg-white px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base md:text-lg font-semibold text-heading-color">
              Owner Details
            </h2>
          </div>
          <div className="border-t border-border-stroke mt-3 pt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Owner Name
              </p>
              <p className="text-sm md:text-base font-medium text-heading-color mt-1 break-words">
                {verificationData.data.name}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#97a7bb]">
                Address
              </p>
              <p className="text-sm md:text-base font-medium text-heading-color mt-1 inline-flex items-center gap-1 break-words">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-inactive-text" />
                {verificationData.data.permanentAddress ||
                  verificationData.data.temporaryAddress ||
                  "N/A"}
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="px-2">
        <ButtonActions>
          <PrimaryButton onClick={() => navigate({ to: "/addvehical" })}>
            Continue to Vehicle
          </PrimaryButton>
        </ButtonActions>
      </section>
    </main>
  );
}
