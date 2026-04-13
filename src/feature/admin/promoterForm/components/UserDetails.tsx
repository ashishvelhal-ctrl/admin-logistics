import { useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import PromoterUserDetailsHeader from "@/feature/promoter/network/components/promoter-user-details/PromoterUserDetailsHeader";
import PromoterUserSidebar from "@/feature/promoter/network/components/promoter-user-details/PromoterUserSidebar";
import PromoterUserStats from "@/feature/promoter/network/components/promoter-user-details/PromoterUserStats";
import { PromoterUserDetailsState } from "@/feature/promoter/network/components/promoter-user-details/PromoterUserDetailsStates";
import { promoterApi } from "../services/promoterApi";
import { useViewDrivingLicense } from "@/feature/promoter/user/hooks/useViewDrivingLicense";

export default function UserDetails() {
  const navigate = useNavigate();
  const { userId, promoterId } = useSearch({ from: "/(admin)/userDetails" });
  const selectedUserId = userId ?? "";
  const { viewDrivingLicense } = useViewDrivingLicense();

  const [activeTab, setActiveTab] = useState<"vehicles" | "trips">("vehicles");
  const [vehiclePage, setVehiclePage] = useState(1);
  const [tripPage, setTripPage] = useState(1);

  const {
    data: userDetails,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ["adminUserDetails", promoterId, selectedUserId],
    queryFn: async () => {
      if (!selectedUserId) return null;
      if (promoterId) {
        const userFromPromoter = await promoterApi.getPromoterUserById(
          promoterId,
          selectedUserId,
        );
        if (userFromPromoter) return userFromPromoter;
      }
      return promoterApi.getAdminUserById(selectedUserId);
    },
    enabled: !!selectedUserId,
  });

  const profileStatusData = useMemo(() => {
    const normalizedStatus = String(userDetails?.profileStatus || "")
      .trim()
      .toLowerCase();
    const phoneVerifiedStatuses = [
      "phone_number_verified",
      "profile_completed",
      "dl_verified",
      "verified",
      "active",
    ];

    const phoneVerified = phoneVerifiedStatuses.includes(normalizedStatus);
    const drivingLicenseVerified =
      normalizedStatus === "dl_verified" ||
      Boolean(userDetails?.drivingLicense) ||
      String(userDetails?.drivingLicenseData?.status || "").toLowerCase() ===
        "verified";

    return {
      profileStatus: userDetails?.profileStatus,
      steps: {
        phoneVerified: { completed: phoneVerified },
      },
      isDrivingLicenseVerified: drivingLicenseVerified,
      drivingLicenseVerified,
    };
  }, [userDetails]);

  const {
    data: vehiclesResponse,
    isLoading: isVehiclesLoading,
    error: vehiclesError,
  } = useQuery({
    queryKey: ["adminUserVehicles", selectedUserId, vehiclePage],
    queryFn: async () => {
      if (!selectedUserId) return null;
      const limit = 5;
      const offset = (vehiclePage - 1) * limit;
      return promoterApi.getAdminUserVehicles(selectedUserId, {
        limit,
        offset,
      });
    },
    enabled: !!selectedUserId,
  });

  const isLoading = isUserLoading || isVehiclesLoading;
  const error = userError || vehiclesError;

  const isVerified = [
    "verified",
    "dl_verified",
    "active",
    "otp_verified",
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

  const vehicleTotalPages = Math.max(
    1,
    Number(vehiclesResponse?.paginationMeta?.total_pages ?? 1),
  );

  if (!selectedUserId) {
    return (
      <PromoterUserDetailsState
        title="No user selected"
        ctaLabel="Back to Promoter"
        onCtaClick={() =>
          navigate({
            to: "/promoterDetails",
            search: { promoterId: promoterId ?? "" },
          })
        }
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-icon-1-color"></div>
        <div className="text-lg">Loading user details...</div>
      </div>
    );
  }

  if (error || !userDetails) {
    return (
      <PromoterUserDetailsState
        title="User not found"
        description={`ID: ${selectedUserId}`}
        ctaLabel="Back to Promoter"
        onCtaClick={() =>
          navigate({
            to: "/promoterDetails",
            search: { promoterId: promoterId ?? "" },
          })
        }
      />
    );
  }

  const handleVerifyPhone = (phoneNumber: string) => {
    navigate({
      to: "/verifyUserOtp",
      search: {
        phone: phoneNumber.replace(/[^\d]/g, "").slice(-10),
        resend: true,
      },
    });
  };

  return (
    <div className="bg-common-bg pr-4 pl-3 pb-6 md:pr-10 md:pl-4">
      <PromoterUserDetailsHeader
        onBack={() =>
          navigate({
            to: "/promoterDetails",
            search: { promoterId: promoterId ?? "" },
          })
        }
      />

      <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
        <PromoterUserSidebar
          userId={selectedUserId}
          userDetails={userDetails}
          profileStatusData={profileStatusData}
          isVerified={isVerified}
          isDrivingLicenseVerified={isDrivingLicenseVerified}
          onVerifyPhone={handleVerifyPhone}
          onViewDrivingLicense={() =>
            viewDrivingLicense(selectedUserId, userDetails)
          }
          onVerifyDrivingLicense={() => navigate({ to: "/drivingLicence" })}
        />

        <PromoterUserStats
          stats={stats}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          vehiclePage={vehiclePage}
          setVehiclePage={setVehiclePage}
          vehicleTotalPages={vehicleTotalPages}
          vehicles={vehicles}
          vehicleServerPaginated
          tripPage={tripPage}
          setTripPage={setTripPage}
          userId={selectedUserId}
          tripApiMode="admin"
          showAddVehicle={false}
          onAddVehicle={() => navigate({ to: "/addvehical" })} //commnet out after the backend is ready
        />
      </div>
    </div>
  );
}
