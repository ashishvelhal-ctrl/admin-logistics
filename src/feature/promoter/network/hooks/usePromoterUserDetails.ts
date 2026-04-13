import { useMemo, useState } from "react";
import { useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { networkApi } from "../services/networkApi";

export function usePromoterUserDetails() {
  const search = useSearch({ from: "/(promoter)/promoterUserDetails" });
  const { userId } = search as { userId?: string };
  const [activeTab, setActiveTab] = useState<"vehicles" | "trips">("vehicles");
  const [vehiclePage, setVehiclePage] = useState(1);
  const [tripPage, setTripPage] = useState(1);

  const {
    data: userDetails,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ["promoterUserDetails", userId],
    queryFn: async () => {
      if (!userId) return null;
      return networkApi.getUserById(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: profileStatusData,
    isLoading: isStatusLoading,
    error: statusError,
  } = useQuery({
    queryKey: ["promoterUserProfileCompletionStatus", userId],
    queryFn: async () => {
      if (!userId) return null;
      return networkApi.getUserProfileCompletionStatus(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });

  const {
    data: vehiclesResponse,
    isLoading: isVehiclesLoading,
    error: vehiclesError,
  } = useQuery({
    queryKey: ["promoterUserVehicles", userId],
    queryFn: async () => {
      if (!userId) return null;
      return networkApi.getUserVehicles(userId, { limit: 100, offset: 0 });
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });

  const isLoading = isUserLoading || isStatusLoading || isVehiclesLoading;
  const error = userError || statusError || vehiclesError;

  const isVerified = [
    "verified",
    "dl_verified",
    "active",
    "otp_verified",
    "phone_number_verified",
    "profile_completed",
  ].includes(
    String(
      profileStatusData?.profileStatus ?? userDetails?.profileStatus ?? "",
    ).toLowerCase(),
  );

  const isDrivingLicenseVerified =
    userDetails?.drivingLicense && userDetails.drivingLicense.trim() !== ""
      ? true
      : (profileStatusData?.isDrivingLicenseVerified ??
        profileStatusData?.drivingLicenseVerified ??
        isVerified);

  const stats = useMemo(
    () => ({
      totalTrips: Number((userDetails as any)?.totalTrips ?? 0),
      requirementPost: Number((userDetails as any)?.requirementPost ?? 0),
      cancellationRate: Number((userDetails as any)?.cancellationRate ?? 0),
    }),
    [userDetails],
  );

  const vehicles = useMemo(() => {
    const rawVehicles = vehiclesResponse?.data ?? [];
    return rawVehicles.map((vehicle: any) => ({
      ...vehicle,
      vehicleType:
        vehicle.vehicleType ??
        vehicle.type ??
        vehicle.loadCapacity ??
        vehicle.model ??
        "-",
      vehicleNumber:
        vehicle.vehicleNumber ??
        vehicle.registrationNumber ??
        vehicle.number ??
        "-",
      vehicleRc: vehicle.vehicleRc ?? vehicle.rcNumber ?? vehicle.rc ?? "-",
    }));
  }, [vehiclesResponse?.data]);

  const vehicleTotalPages = Math.max(1, Math.ceil(vehicles.length / 5));

  return {
    userId,
    activeTab,
    setActiveTab,
    vehiclePage,
    setVehiclePage,
    tripPage,
    setTripPage,
    userDetails,
    profileStatusData,
    isLoading,
    error,
    isVerified,
    isDrivingLicenseVerified,
    stats,
    vehicles,
    vehicleTotalPages,
  };
}
