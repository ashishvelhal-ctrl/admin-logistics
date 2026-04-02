import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";

import { networkApi } from "@/feature/promoter/network/services/networkApi";
import { authAtom } from "@/atoms/authAtom";

import PromoterNetworkTable, {
  type PromoterNetworkMember,
} from "@/feature/admin/promoterForm/components/PromoterNetworkTable";
import StatusPieChart from "@/feature/admin/promoterForm/components/StatusPieChart";
import PromoterContactInfo from "@/feature/admin/promoterForm/components/PromoterContactInfo";

import { FormHeader } from "@/components/common/FormHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PromoterProfile {
  id: string;
  fullName: string;
  mobileNumber: string;
  assignedAddress: string;
  isActive: boolean;
  totalOnboard: number;
  totalEarnings: number;
  targetCurrent: number;
  targetTotal: number;
  networkMembers: PromoterNetworkMember[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

function getStatusCount(
  members: PromoterNetworkMember[],
  status: PromoterNetworkMember["status"],
) {
  return members.filter((member) => member.status === status).length;
}

export default function PromoterProfile() {
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);

  // Get real promoter users data from API using the same API as MyNetworkList
  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["promoterProfileUsers"],
    queryFn: () => networkApi.getUsers({ limit: 100, offset: 0 }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Parse promoter data from auth state with error handling
  let promoterUser = null;
  try {
    // Handle different formats of user data in auth state
    if (authState.user) {
      // Try to parse as JSON first
      try {
        promoterUser = JSON.parse(authState.user);
      } catch {
        // If parsing fails, treat it as a plain string (name)
        // We'll need to fetch additional data from backend
        promoterUser = {
          name: authState.user,
          // These will be updated with real data from backend
          phoneNumber: null,
          address: null,
          id: null,
        };
      }
    }
  } catch (error) {
    console.error("Failed to process auth user data:", error);
    promoterUser = null;
  }

  // Format phone number to add space between country code and number
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "N/A";
    // If phone starts with +91, add space after it
    if (phone.startsWith("+91") && phone.length > 3) {
      return `+91 ${phone.slice(3)}`;
    }
    return phone;
  };

  // If we don't have complete promoter data, we should fetch it from backend
  // For now, we'll use the auth data and API data to build the profile
  const promoter: PromoterProfile = {
    id: promoterUser?.id || authState.user || "1",
    fullName: promoterUser?.name || authState.user || "Promoter",
    mobileNumber: formatPhoneNumber(
      promoterUser?.phoneNumber ||
        usersData?.data?.[0]?.phoneNumber ||
        "xxxxxxxxxx",
    ),
    assignedAddress:
      promoterUser?.address || usersData?.data?.[0]?.address || "Pune",
    isActive: true,
    totalOnboard: usersData?.data?.length || 0,
    totalEarnings:
      usersData?.data?.reduce(
        (sum: number, user: any) =>
          sum + (user.profileStatus === "verified" ? 10 : 0),
        0,
      ) || 0,
    targetCurrent:
      usersData?.data?.reduce(
        (sum: number, user: any) =>
          sum + (user.profileStatus === "verified" ? 10 : 0),
        0,
      ) || 0,
    targetTotal: (usersData?.data?.length || 0) * 20 || 2000, // Dynamic target based on total users
    networkMembers:
      usersData?.data?.map((user: any) => ({
        id: parseInt(user.id),
        name: user.name,
        phone: user.phoneNumber,
        status:
          user.profileStatus === "verified"
            ? "completed"
            : user.profileStatus === "pending"
              ? "pending"
              : "inProgress",
      })) || [],
  };

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <div className="text-lg text-red-600">Error loading profile data</div>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: "/myNetwork" })}
        >
          Back to Network
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  const completedCount = getStatusCount(promoter.networkMembers, "completed");
  const inProgressCount = getStatusCount(promoter.networkMembers, "inProgress");
  const pendingCount = getStatusCount(promoter.networkMembers, "pending");

  return (
    <div className="bg-common-bg pr-10 pl-4 pb-6">
      <FormHeader
        title="My Profile"
        description="View your profile information and network details."
        onBack={() => navigate({ to: "/myNetwork" })}
      />

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardContent className="space-y-5 p-5">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-icon-bg text-xl font-bold text-icon-1-color">
                  {getInitials(promoter.fullName)}
                </div>
                <h2 className="text-2xl font-semibold text-heading-color">
                  {promoter.fullName}
                </h2>
                <span
                  className={cn(
                    "mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                    promoter.isActive
                      ? "bg-icon-bg text-icon-1-color"
                      : "bg-button-2-bg text-icon-2-color",
                  )}
                >
                  {promoter.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>

              <PromoterContactInfo
                mobileNumber={promoter.mobileNumber}
                assignedAddress={promoter.assignedAddress}
              />

              <div className="border-t pt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Account Actions
                </p>
                <Button
                  type="button"
                  onClick={() =>
                    navigate({
                      to: "/editProfile",
                      search: {
                        fullName: promoter.fullName,
                        mobileNumber: promoter.mobileNumber,
                        assignedAddress: promoter.assignedAddress,
                      },
                    })
                  }
                  className="w-full bg-icon-1-color text-white hover:bg-icon-1-color/90"
                >
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="space-y-4 p-5">
              <h3 className="text-xl font-semibold text-heading-color">
                Status Tracking
              </h3>

              <StatusPieChart
                completedCount={completedCount}
                inProgressCount={inProgressCount}
                pendingCount={pendingCount}
                totalMembers={promoter.networkMembers.length}
              />
            </CardContent>
          </Card>
        </div>

        <PromoterNetworkTable
          totalOnboard={promoter.totalOnboard}
          totalEarnings={promoter.totalEarnings}
          targetCurrent={promoter.targetCurrent}
          targetTotal={promoter.targetTotal}
          networkMembers={promoter.networkMembers}
        />
      </div>
    </div>
  );
}
