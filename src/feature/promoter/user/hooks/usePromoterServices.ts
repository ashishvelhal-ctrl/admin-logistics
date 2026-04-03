import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

// Types for API responses
interface DLVerificationResponse {
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

interface VehicleVerificationResponse {
  message: string;
  data: {
    vehicleNumber: string;
    registrationDate: string;
    registerDate: string;
    owner: string;
    model: string;
    vehicleType: string;
    fuelType: string;
    manufacturer: string;
    bodyType: string;
    engineNumber: string;
    chassisNumber: string;
    fitnessValidTill: string;
    insuranceValidTill: string;
    registrationCertificateNumber: string;
    registrationUpto: string;
    taxValidUpto: string;
    pollutionValidUpto: string;
    manufacturerModel: string;
    manufacturerSlNo: string;
    blackListStatus: string;
    insuranceCompany: string;
    insurancePolicyNumber: string;
    pucNumber: string;
    pucValidUpto: string;
    pucIssuedDate: string;
    status: string;
    verificationSource: string;
  };
}

export const usePromoterServices = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Driving License Verification
  const verifyDrivingLicense = async (
    dlNumber: string,
    dateOfBirth: string,
  ): Promise<DLVerificationResponse> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/promoter/verify-driving-license", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "69ccb2fa7e2be2e4af126242", // This should come from auth context
          dlNumber,
          dateOfBirth,
        }),
      });

      if (!response.ok) {
        throw new Error("Verification failed");
      }

      const result = await response.json();

      // Store verification data in session storage
      sessionStorage.setItem("dlVerificationData", JSON.stringify(result));

      return result;
    } catch (error) {
      console.error("DL Verification Error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Vehicle Verification
  const verifyVehicle = async (
    vehicleNumber: string,
  ): Promise<VehicleVerificationResponse> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/promoter/verify-vehicle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "69ccb2fa7e2be2e4af126242", // This should come from auth context
          vehicleNumber,
        }),
      });

      if (!response.ok) {
        throw new Error("Vehicle verification failed");
      }

      const result = await response.json();

      // Store verification data in session storage
      sessionStorage.setItem("vehicleVerificationData", JSON.stringify(result));

      return result;
    } catch (error) {
      console.error("Vehicle Verification Error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create Vehicle
  const createVehicle = async (vehicleData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/promoter/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "69ccb2fa7e2be2e4af126242", // This should come from auth context
          ...vehicleData,
        }),
      });

      if (!response.ok) {
        throw new Error("Vehicle creation failed");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Vehicle Creation Error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to verification pages
  const goToDLVerification = () => {
    navigate({ to: "/verifyDrivingLicence" });
  };

  const goToVehicleVerification = () => {
    navigate({ to: "/verificationVehical" });
  };

  const goToVehicleCreation = () => {
    navigate({ to: "/addvehical" });
  };

  return {
    isLoading,
    verifyDrivingLicense,
    verifyVehicle,
    createVehicle,
    goToDLVerification,
    goToVehicleVerification,
    goToVehicleCreation,
  };
};
