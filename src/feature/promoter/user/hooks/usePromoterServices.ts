import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
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
    try {
      return await verifyDrivingLicenseMutation.mutateAsync({
        dlNumber,
        dateOfBirth,
      });
    } catch (error) {
      console.error("DL Verification Error:", error);
      throw error;
    }
  };

  // Vehicle Verification
  const verifyVehicle = async (
    vehicleNumber: string,
  ): Promise<VehicleVerificationResponse> => {
    try {
      return await verifyVehicleMutation.mutateAsync(vehicleNumber);
    } catch (error) {
      console.error("Vehicle Verification Error:", error);
      throw error;
    }
  };

  // Create Vehicle
  const createVehicle = async (vehicleData: any) => {
    try {
      return await createVehicleMutation.mutateAsync(vehicleData);
    } catch (error) {
      console.error("Vehicle Creation Error:", error);
      throw error;
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

  const verifyDrivingLicenseMutation = useMutation({
    mutationFn: async ({
      dlNumber,
      dateOfBirth,
    }: {
      dlNumber: string;
      dateOfBirth: string;
    }): Promise<DLVerificationResponse> => {
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
      sessionStorage.setItem("dlVerificationData", JSON.stringify(result));
      return result;
    },
    onSuccess: async () => {
      const userId = getVerifiedUserId();
      await queryClient.invalidateQueries({ queryKey: ["my-network-users"] });
      await queryClient.invalidateQueries({
        queryKey: ["promoterUserDetails", userId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["promoterUserProfileCompletionStatus", userId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["promoterProfileUsers"],
      });
    },
  });

  const verifyVehicleMutation = useMutation({
    mutationFn: async (
      vehicleNumber: string,
    ): Promise<VehicleVerificationResponse> => {
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

      sessionStorage.setItem("vehicleVerificationData", JSON.stringify(result));
      return result;
    },
    onSuccess: async () => {
      const userId = getVerifiedUserId();
      await queryClient.invalidateQueries({
        queryKey: ["user-vehicles", userId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["promoterUserVehicles", userId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["vehicleDetailsVehicles", "promoter", userId],
      });
    },
  });

  const createVehicleMutation = useMutation({
    mutationFn: async (vehicleData: any) => {
      const userId = getVerifiedUserId();
      return promoterService.createVehicle({
        userId,
        rcNumber: vehicleData.rcNumber,
        loadCapacity: vehicleData.loadCapacity,
        specialCapabilities: vehicleData.specialCapabilities || [],
        thumbnailImage: vehicleData.thumbnailImage,
        additionalImages: vehicleData.additionalImages,
      });
    },
    onSuccess: async () => {
      const userId = getVerifiedUserId();
      await queryClient.invalidateQueries({
        queryKey: ["user-vehicles", userId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["promoterUserVehicles", userId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["vehicleDetailsVehicles", "promoter", userId],
      });
    },
  });

  const isLoading = useMemo(
    () =>
      verifyDrivingLicenseMutation.isPending ||
      verifyVehicleMutation.isPending ||
      createVehicleMutation.isPending,
    [
      verifyDrivingLicenseMutation.isPending,
      verifyVehicleMutation.isPending,
      createVehicleMutation.isPending,
    ],
  );

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
