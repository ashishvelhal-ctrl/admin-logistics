import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { promoterService } from "../service/promoter.service";

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
  const VERIFIED_USER_STORAGE_KEY = "promoter_verified_user";

  const getVerifiedUserId = (): string => {
    try {
      const raw = sessionStorage.getItem(VERIFIED_USER_STORAGE_KEY);
      if (!raw) {
        throw new Error("Please verify user OTP before continuing.");
      }
      const parsed = JSON.parse(raw) as { id?: string };
      if (!parsed?.id) {
        throw new Error("Verified user was not found. Please retry OTP flow.");
      }
      return parsed.id;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Unable to resolve verified user.");
    }
  };

  // Driving License Verification
  const verifyDrivingLicense = async (
    dlNumber: string,
    dateOfBirth: string,
  ): Promise<DLVerificationResponse> => {
    setIsLoading(true);
    try {
      const userId = getVerifiedUserId();
      const response = await promoterService.verifyDrivingLicense({
        userId,
        dlNumber,
        dateOfBirth,
      });

      const verificationResult = response.data?.verification ?? response.data;
      const result = {
        message: response.message,
        data: verificationResult,
      };

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
      const userId = getVerifiedUserId();
      const response = await promoterService.createVehicle({
        userId,
        rcNumber: vehicleNumber,
        loadCapacity: "4-10T",
        specialCapabilities: [],
      });
      const result = {
        message: response.message,
        data: {
          vehicleNumber,
          registrationDate: "",
          registerDate: "",
          owner: "",
          model: "",
          vehicleType: "",
          fuelType: "",
          manufacturer: "",
          bodyType: "",
          engineNumber: "",
          chassisNumber: "",
          fitnessValidTill: "",
          insuranceValidTill: "",
          registrationCertificateNumber: "",
          registrationUpto: "",
          taxValidUpto: "",
          pollutionValidUpto: "",
          manufacturerModel: "",
          manufacturerSlNo: "",
          blackListStatus: "",
          insuranceCompany: "",
          insurancePolicyNumber: "",
          pucNumber: "",
          pucValidUpto: "",
          pucIssuedDate: "",
          status: "verified",
          verificationSource: "vehicle_creation",
          ...(response.data ?? {}),
        },
      };

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
      const userId = getVerifiedUserId();
      const response = await promoterService.createVehicle({
        userId,
        rcNumber: vehicleData.rcNumber,
        loadCapacity: vehicleData.loadCapacity,
        specialCapabilities: vehicleData.specialCapabilities || [],
        thumbnailImage: vehicleData.thumbnailImage,
        additionalImages: vehicleData.additionalImages,
      });
      return response;
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
