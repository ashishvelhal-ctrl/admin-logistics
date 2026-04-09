import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, MapPin, Phone, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationWrapper as Pagination } from "@/components/common/Pagination";
import { cn } from "@/lib/utils";
import { networkApi } from "../services/networkApi";
import { formatDate } from "@/lib/format-utils";
import { usePromoterUserDetails } from "../hooks/usePromoterUserDetails";
import type { UserTrip } from "../schema/networkTypes";
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
  const VEHICLES_PER_PAGE = 5;
  const MOBILE_TRIPS_PER_PAGE = 5;

  const {
    data: mobileTripsData,
    isLoading: isMobileTripsLoading,
    error: mobileTripsError,
  } = useQuery({
    queryKey: ["mobile-user-trips", userId, tripPage],
    queryFn: async () => {
      const offset = (tripPage - 1) * MOBILE_TRIPS_PER_PAGE;
      return networkApi.getUserTrips(userId!, {
        limit: MOBILE_TRIPS_PER_PAGE,
        offset,
      });
    },
    enabled: !!userId,
  });

  const mobileTrips = mobileTripsData?.data || [];
  const mobileTripPages = mobileTripsData?.paginationMeta?.total_pages || 1;

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
        licenseNumber: userDetails.drivingLicense || "N/A",
        name: userDetails.name || "N/A",
        dob: userDetails.dateOfBirth || "N/A",
        state: "N/A",
        dateOfIssue: "N/A",
        dateOfExpiry: "N/A",
        gender: "N/A",
        permanentAddress: userDetails.address || "N/A",
        temporaryAddress: userDetails.address || "N/A",
        fatherOrHusbandName: "N/A",
        citizenship: "N/A",
        olaName: "N/A",
        olaCode: "N/A",
        clientId: userId,
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

  const phoneValue = userDetails.phoneNumber || "";
  const formattedPhone = phoneValue.startsWith("+91")
    ? `+91 ${phoneValue.slice(3)}`
    : phoneValue;
  const userInitials = (userDetails.name || "U")
    .split(" ")
    .filter(Boolean)
    .map((part: string) => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
  const activeVehicles = vehicles.slice(
    (vehiclePage - 1) * VEHICLES_PER_PAGE,
    (vehiclePage - 1) * VEHICLES_PER_PAGE + VEHICLES_PER_PAGE,
  );

  const formatTripDate = (dateValue: string) => {
    if (!dateValue) return "N/A";
    return formatDate(dateValue, { invalidValue: dateValue });
  };

  const formatTripAmount = (amount: number | undefined) => {
    const safeAmount = Number.isFinite(amount) ? Number(amount) : 0;
    return `₹${safeAmount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="bg-common-bg px-3 pb-6 md:pr-10 md:pl-4">
      <PromoterUserDetailsHeader
        onBack={() => navigate({ to: "/myNetwork" })}
      />

      <section className="space-y-4 md:hidden">
        <Card className="border-border-stroke bg-icon-1-color text-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-lg font-semibold">
                  {userInitials}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {userDetails.name}
                  </h2>
                  <div className="mt-1 flex items-center gap-2 text-xs text-white/90">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{formattedPhone || "N/A"}</span>
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{userDetails.address || "Pune"}</span>
                  </div>
                  <p className="mt-2 text-xs font-medium text-white/80">
                    {isVerified ? "Active" : "Pending"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="text-xs font-medium text-white/90 underline underline-offset-2"
                onClick={() =>
                  navigate({
                    to: "/editUser",
                    search: {
                      userId: String(userId),
                      name: userDetails.name,
                      mobileNumber: userDetails.phoneNumber,
                      address: userDetails.address,
                    },
                  })
                }
              >
                Edit Profile
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border-stroke shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-heading-color">
              Verification
            </h3>
            <div className="mt-3 flex items-center justify-between rounded-md bg-common-bg px-3 py-3">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-heading-color">
                <CheckCircle2 className="h-4 w-4 text-icon-1-color" />
                Driving License
              </div>
              {isDrivingLicenseVerified ? (
                <button
                  type="button"
                  onClick={handleViewDrivingLicense}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F7D60]"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  VERIFIED
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate({ to: "/drivingLicence" })}
                  className="inline-flex items-center rounded-md bg-icon-1-color px-2.5 py-1 text-xs font-semibold text-white"
                >
                  VERIFY
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-2">
          <Card className="border-border-stroke shadow-sm">
            <CardContent className="px-3 py-2.5">
              <p className="text-xs text-muted-foreground">Total Trips</p>
              <p className="text-xl font-bold text-heading-color">
                {stats.totalTrips}
              </p>
              <p className="text-[11px] text-[#2F7D60]">+12% this month</p>
            </CardContent>
          </Card>
          <Card className="border-border-stroke shadow-sm">
            <CardContent className="px-3 py-2.5">
              <p className="text-xs text-muted-foreground">Require Post</p>
              <p className="text-xl font-bold text-heading-color">
                {stats.requirementPost}
              </p>
              <p className="text-[11px] text-[#2F7D60]">+12% this month</p>
            </CardContent>
          </Card>
          <Card className="border-border-stroke shadow-sm">
            <CardContent className="px-3 py-2.5">
              <p className="text-xs text-muted-foreground">Cancel Rate</p>
              <p className="text-xl font-bold text-heading-color">
                {stats.cancellationRate}%
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="mb-3 text-xl font-semibold text-heading-color">
            User Overview
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("vehicles")}
              className={cn(
                "h-10 rounded-md border text-sm font-semibold",
                activeTab === "vehicles"
                  ? "border-icon-1-color bg-icon-1-color text-white"
                  : "border-icon-1-color text-icon-1-color",
              )}
            >
              Vehicles List
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("trips")}
              className={cn(
                "h-10 rounded-md border text-sm font-semibold",
                activeTab === "trips"
                  ? "border-icon-1-color bg-icon-1-color text-white"
                  : "border-icon-1-color text-icon-1-color",
              )}
            >
              Trip History
            </button>
          </div>
        </div>

        {activeTab === "vehicles" ? (
          <div className="space-y-3">
            {activeVehicles.length > 0 ? (
              activeVehicles.map((vehicle: any, index: number) => (
                <Card
                  key={String(vehicle?.id || vehicle?.vehicleNumber || index)}
                  className="border-border-stroke shadow-sm"
                >
                  <CardContent className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-base font-semibold text-heading-color">
                        {vehicle.vehicleType || "Vehicle"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.vehicleNumber || vehicle.vehicleRc || "N/A"}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F7D60]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      VERIFIED
                    </span>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-border-stroke shadow-sm">
                <CardContent className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No vehicles available.
                </CardContent>
              </Card>
            )}
            <Pagination
              currentPage={vehiclePage}
              totalPages={vehicleTotalPages}
              onPageChange={setVehiclePage}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/addvehical" })}
              className="h-10 w-full border-icon-1-color text-icon-1-color hover:bg-icon-1-color/5"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Vehicle
            </Button>
          </div>
        ) : (
          <Card className="overflow-hidden border-border-stroke shadow-sm">
            <CardContent className="p-0">
              <div className="border-b border-border-stroke bg-[#F8FAF9] px-4 py-3">
                <h3 className="text-lg font-semibold text-heading-color">
                  Trip History
                </h3>
              </div>
              <div className="space-y-2 p-2.5">
                {isMobileTripsLoading ? (
                  <Card className="border-[#D7DEDC] shadow-sm">
                    <CardContent className="px-4 py-5 text-sm text-muted-foreground">
                      Loading trip history...
                    </CardContent>
                  </Card>
                ) : mobileTripsError ? (
                  <Card className="border-[#D7DEDC] shadow-sm">
                    <CardContent className="px-4 py-5 text-sm text-red-600">
                      Failed to load trip history.
                    </CardContent>
                  </Card>
                ) : mobileTrips.length === 0 ? (
                  <Card className="border-[#D7DEDC] shadow-sm">
                    <CardContent className="px-4 py-5 text-sm text-muted-foreground">
                      No trips available.
                    </CardContent>
                  </Card>
                ) : (
                  mobileTrips.map((trip: UserTrip, index: number) => {
                    const fromLocation = trip.startLocation?.address || "Pune";
                    const toLocation = trip.endLocation?.address || "Mumbai";
                    const statusText = trip.status || "completed";
                    return (
                      <Card
                        key={String(trip?.id || index)}
                        className="border-[#D7DEDC] shadow-sm"
                      >
                        <CardContent className="flex items-center justify-between px-4 py-4">
                          <div className="min-w-0">
                            <p className="truncate text-lg font-semibold text-heading-color">
                              {fromLocation} {"\u2192"} {toLocation}
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-xs">
                              <span className="uppercase tracking-wide text-[#9CA3AF]">
                                {formatTripDate(trip.date)}
                              </span>
                              <span className="text-[#9CA3AF]">•</span>
                              <span className="font-semibold capitalize text-[#15803D]">
                                {statusText}
                              </span>
                            </div>
                          </div>
                          <p className="ml-3 shrink-0 text-xl font-semibold text-[#111827]">
                            {formatTripAmount(trip.price)}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
                <Pagination
                  currentPage={tripPage}
                  totalPages={mobileTripPages}
                  onPageChange={setTripPage}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: "/addvehical" })}
                  className="h-10 w-full border-icon-1-color text-icon-1-color hover:bg-icon-1-color/5"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Vehicle
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      <section className="hidden md:block">
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
      </section>
    </div>
  );
}
