import { useNavigate } from "@tanstack/react-router";

import { usePromoterUserDetails } from "../hooks/usePromoterUserDetails";
import PromoterUserDetailsHeader from "./promoter-user-details/PromoterUserDetailsHeader";
import PromoterUserSidebar from "./promoter-user-details/PromoterUserSidebar";
import PromoterUserStats from "./promoter-user-details/PromoterUserStats";
import { PromoterUserDetailsState } from "./promoter-user-details/PromoterUserDetailsStates";

export default function PromoterUserDetails() {
  const navigate = useNavigate();
  const {
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
  } = usePromoterUserDetails();

  if (!userId) {
    return (
      <PromoterUserDetailsState
        title="No user selected"
        ctaLabel="Back to Network"
        onCtaClick={() => navigate({ to: "/myNetwork" })}
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
        description={`ID: ${userId}`}
        ctaLabel="Back to Network"
        onCtaClick={() => navigate({ to: "/myNetwork" })}
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

  const handleViewDrivingLicense = () => {
    const dlData = {
      message: "Driving license verified",
      data: {
        licenseNumber: userDetails?.drivingLicense || "N/A",
        name: userDetails?.name || "N/A",
        dob: userDetails?.dateOfBirth || "N/A",
        state: "N/A",
        dateOfIssue: "N/A",
        dateOfExpiry: "N/A",
        gender: "N/A",
        permanentAddress: userDetails?.address || "N/A",
        temporaryAddress: userDetails?.address || "N/A",
        fatherOrHusbandName: "N/A",
        citizenship: "N/A",
        olaName: "N/A",
        olaCode: "N/A",
        clientId: userId || "N/A",
        permanentZip: "N/A",
        cityName: "N/A",
        temporaryZip: "N/A",
        transportDateOfExpiry: "N/A",
        transportDateOfIssue: "N/A",
        bloodGroup: "N/A",
        vehicleClasses: [],
        additionalCheck: [],
        initialDateOfIssue: "N/A",
        currentStatus: null,
        vehicleClassDescription: [],
        status: "VERIFIED",
        verificationSource: "System",
      },
    };

    sessionStorage.setItem("dlVerificationData", JSON.stringify(dlData));
    navigate({ to: "/verifyDrivingLicence" });
  };

  return (
    <div className="bg-common-bg pr-4 pl-3 pb-6 md:pr-10 md:pl-4">
      <PromoterUserDetailsHeader
        onBack={() => navigate({ to: "/myNetwork" })}
      />

      <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
        <PromoterUserSidebar
          userId={userId}
          userDetails={userDetails}
          profileStatusData={profileStatusData}
          isVerified={isVerified}
          isDrivingLicenseVerified={isDrivingLicenseVerified}
          onVerifyPhone={handleVerifyPhone}
          onViewDrivingLicense={handleViewDrivingLicense}
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
          tripPage={tripPage}
          setTripPage={setTripPage}
          userId={userId}
          onAddVehicle={() => navigate({ to: "/addvehical" })}
        />
      </div>
    </div>
  );
}
