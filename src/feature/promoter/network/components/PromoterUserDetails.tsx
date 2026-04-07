import { useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, MapPin, Phone, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { networkApi } from "../services/networkApi";
import VehicleTable from "./VehicleTable";
import TripTable from "./TripTable";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PromoterUserDetails() {
  const navigate = useNavigate();
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
  });

  const isLoading = isUserLoading || isStatusLoading || isVehiclesLoading;
  const error = userError || statusError || vehiclesError;

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

  const vehicleTotalPages = Math.max(1, Math.ceil(vehicles.length / 5));

  if (!userId) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <div className="text-lg">No user selected</div>
        <Button onClick={() => navigate({ to: "/myNetwork" })}>
          Back to Network
        </Button>
      </div>
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
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <div className="text-lg">User not found</div>
        <div className="text-sm text-gray-500">ID: {userId}</div>
        <Button onClick={() => navigate({ to: "/myNetwork" })}>
          Back to Network
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-common-bg pr-4 pl-3 pb-6 md:pr-10 md:pl-4">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-heading-color md:text-2xl">
            User Profile
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            View onboarding progress and user information
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: "/myNetwork" })}
          className="inline-flex items-center gap-2 self-start text-xs font-medium text-icon-1-color hover:opacity-80 md:text-sm"
        >
          <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
          Back to Promoter Detail
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
        <div className="space-y-5">
          <Card className="border-border-stroke shadow-sm">
            <CardContent className="p-4 md:p-5">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-icon-bg text-xl font-bold text-icon-1-color md:h-20 md:w-20 md:text-2xl">
                  {userDetails.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <h2 className="text-xl font-semibold text-heading-color md:text-2xl">
                  {userDetails.name}
                </h2>
                <span
                  className={cn(
                    "mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                    isVerified
                      ? "bg-[#E5F4EC] text-[#2F7D60]"
                      : "bg-[#FEF3C7] text-[#92400E]",
                  )}
                >
                  {isVerified ? "Active" : "Pending"}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-md bg-common-bg px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Phone className="h-3.5 w-3.5 text-icon-1-color md:h-4 md:w-4" />
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        Phone Number
                      </p>
                      <p className="text-sm font-semibold text-heading-color">
                        {userDetails.phoneNumber}
                      </p>
                    </div>
                  </div>
                  {profileStatusData?.steps?.phoneVerified?.completed ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2F7D60]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      VERIFIED
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const phoneNumber = userDetails?.phoneNumber;
                        if (phoneNumber) {
                          // Navigate to OTP resend with phone number for existing user
                          navigate({
                            to: "/verifyUserOtp",
                            search: {
                              phone: phoneNumber
                                .replace(/[^\d]/g, "")
                                .slice(-10),
                              resend: true,
                            },
                          });
                        }
                      }}
                      className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-md bg-icon-1-color text-white hover:bg-icon-1-color/90 transition-colors"
                    >
                      VERIFY NOW
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 rounded-md bg-common-bg px-3 py-2">
                  <MapPin className="h-3.5 w-3.5 text-icon-1-color md:h-4 md:w-4" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Address
                    </p>
                    <p className="text-sm font-semibold text-heading-color">
                      {userDetails.address || "Pune"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border-stroke shadow-sm">
            <CardContent className="p-4 md:p-5">
              <h3 className="text-lg font-semibold text-heading-color">
                Verification
              </h3>
              <div className="mt-4 rounded-md bg-common-bg px-3 py-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-heading-color">
                    <CheckCircle2 className="h-4 w-4 text-icon-1-color" />
                    Driving License
                  </div>
                  {isDrivingLicenseVerified ? (
                    <button
                      type="button"
                      onClick={() => {
                        // Create mock DL data from user details for viewing
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
                        sessionStorage.setItem(
                          "dlVerificationData",
                          JSON.stringify(dlData),
                        );
                        navigate({ to: "/verifyDrivingLicence" });
                      }}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-md bg-[#2F7D60] text-white hover:bg-[#2F7D60]/90 transition-colors"
                    >
                      VIEW
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate({ to: "/drivingLicence" })}
                      disabled={
                        !profileStatusData?.steps?.phoneVerified?.completed
                      }
                      className={cn(
                        "inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-md transition-colors",
                        profileStatusData?.steps?.phoneVerified?.completed
                          ? "bg-icon-1-color text-white hover:bg-icon-1-color/90"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed",
                      )}
                    >
                      VERIFY
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Card className="border-border-stroke shadow-sm">
              <CardContent className="px-4 py-3">
                <p className="text-sm text-muted-foreground">Total Trips</p>
                <p className="text-3xl font-bold text-heading-color">
                  {stats.totalTrips}
                </p>
                <p className="text-sm text-[#2F7D60]">+12% this month</p>
              </CardContent>
            </Card>
            <Card className="border-border-stroke shadow-sm">
              <CardContent className="px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  Requirement Post
                </p>
                <p className="text-3xl font-bold text-heading-color">
                  {stats.requirementPost}
                </p>
                <p className="text-sm text-[#6FBF8D]">Calculated weekly</p>
              </CardContent>
            </Card>
            <Card className="border-border-stroke shadow-sm">
              <CardContent className="px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  Cancellation Rate
                </p>
                <p className="text-3xl font-bold text-heading-color">
                  {stats.cancellationRate}%
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-3">
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

          <Card className="overflow-hidden border-border-stroke shadow-sm">
            <CardContent className="p-0">
              <div className="flex items-center justify-between border-b border-border-stroke bg-[#F8FAF9] px-5 py-4">
                <h3 className="text-xl font-semibold text-heading-color md:text-2xl">
                  {activeTab === "vehicles"
                    ? "Vehicle Details"
                    : "User Trip History"}
                </h3>
                {activeTab === "vehicles" && (
                  <Button
                    type="button"
                    onClick={() => navigate({ to: "/addvehical" })}
                    className="h-8 bg-icon-1-color px-3 text-xs text-white hover:bg-icon-1-color/90"
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Add Vehicle
                  </Button>
                )}
              </div>

              {activeTab === "vehicles" ? (
                <VehicleTable
                  vehicles={vehicles}
                  currentPage={vehiclePage}
                  onPageChange={setVehiclePage}
                  totalPages={vehicleTotalPages}
                />
              ) : (
                <TripTable
                  userId={userId || ""}
                  currentPage={tripPage}
                  onPageChange={setTripPage}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
