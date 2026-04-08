import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { usePromoterServices } from "./usePromoterServices";

export function useDrivingLicence() {
  const navigate = useNavigate();
  const [licenceNumber, setLicenceNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const { isLoading, verifyDrivingLicense } = usePromoterServices();

  const handleCancel = () => {
    navigate({ to: "/addvehical" });
  };

  const handleContinue = async () => {
    if (!licenceNumber || !dateOfBirth) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await verifyDrivingLicense(licenceNumber, dateOfBirth);
      navigate({ to: "/verifyDrivingLicence" });
    } catch (error) {
      alert("Verification failed. Please check your details and try again.");
    }
  };

  return {
    licenceNumber,
    setLicenceNumber,
    dateOfBirth,
    setDateOfBirth,
    isLoading,
    handleCancel,
    handleContinue,
  };
}
