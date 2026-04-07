import { useNavigate, useSearch } from "@tanstack/react-router";
import { Ban, Loader2, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { promoterApi } from "../services/promoterApi";
import PromoterNetworkTable, {
  type PromoterNetworkMember,
} from "./PromoterNetworkTable";

import StatusPieChart from "./StatusPieChart";
import PromoterContactInfo from "./PromoterContactInfo";

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

export default function PromoterDetails() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/(admin)/promoterDetails" });
  const { promoterId } = search as { promoterId?: string };
  const queryClient = useQueryClient();

  // Fetch promoter data
  const {
    data: promoterData,
    isLoading: isLoadingPromoter,
    error: promoterError,
  } = useQuery({
    queryKey: ["promoterDetails", promoterId],
    queryFn: async () => {
      if (!promoterId) return null;
      return promoterApi.getPromoterById(promoterId);
    },
    enabled: !!promoterId,
  });

  // Delete/Deactivate promoter mutation
  const deletePromoterMutation = useMutation({
    mutationFn: async (id: string) => {
      return promoterApi.deletePromoter(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["promoterDetails", promoterId],
      });
      queryClient.invalidateQueries({ queryKey: ["promoters"] });
    },
  });

  // Restore/Activate promoter mutation
  const restorePromoterMutation = useMutation({
    mutationFn: async (id: string) => {
      return promoterApi.restorePromoter(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["promoterDetails", promoterId],
      });
      queryClient.invalidateQueries({ queryKey: ["promoters"] });
    },
  });
  // Fetch promoter users using admin endpoint
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useQuery({
    queryKey: ["promoterUsers", promoterId],
    queryFn: async () => {
      if (!promoterId) return { data: [], total: 0 };
      return promoterApi.getPromoterUsers(promoterId, { limit: 100 });
    },
    enabled: !!promoterId,
  });

  // Transform API data to component format
  const promoter: PromoterProfile | null = promoterData
    ? {
        id: promoterData.id || promoterId || "1",
        fullName: promoterData.fullName || promoterData.name || "Promoter",
        mobileNumber:
          promoterData.mobileNumber || promoterData.phoneNumber || "9876543210",
        assignedAddress:
          promoterData.assignedAddress || promoterData.address || "Pune",
        isActive:
          promoterData.isActive !== false && promoterData.isDeleted !== true,
        totalOnboard: usersData?.total || 0,
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
        targetTotal: (usersData?.total || 0) * 20 || 2000,
        networkMembers:
          usersData?.data?.map((user: any) => ({
            id: user.id || String(Math.random()),
            name: user.name || "Unknown",
            phone: user.phoneNumber || "N/A",
            status:
              user.profileStatus === "verified" ||
              user.profileStatus === "phone_number_verified" ||
              user.profileStatus === "dl_verified" ||
              user.profileStatus === "profile_completed"
                ? "completed"
                : user.profileStatus === "pending"
                  ? "pending"
                  : "inProgress",
          })) || [],
      }
    : null;

  if (promoterError || usersError) {
    console.error("Promoter API Error:", promoterError);
    console.error("Users API Error:", usersError);
  }

  if (!promoterId) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <div className="text-lg">No promoter selected</div>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: "/promoterList" })}
        >
          Back to Promoter List
        </Button>
      </div>
    );
  }

  if (isLoadingPromoter || isLoadingUsers) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <div className="text-lg">Loading promoter details...</div>
      </div>
    );
  }

  if (!promoter) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <div className="text-lg">Promoter not found</div>
        <div className="text-sm text-gray-500">ID: {promoterId}</div>
        {promoterError && (
          <div className="text-sm text-red-500">
            {(promoterError as Error).message}
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: "/promoterList" })}
        >
          Back to Promoter List
        </Button>
      </div>
    );
  }

  const completedCount = getStatusCount(promoter.networkMembers, "completed");
  const inProgressCount = getStatusCount(promoter.networkMembers, "inProgress");
  const pendingCount = getStatusCount(promoter.networkMembers, "pending");

  return (
    <div className="bg-common-bg pr-10 pl-4 pb-6">
      <FormHeader
        title="Promoter Details"
        description="View promoter information and network details."
        onBack={() => navigate({ to: "/promoterList" })}
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
                {promoter.isActive ? (
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                    onClick={() =>
                      promoterId && deletePromoterMutation.mutate(promoterId)
                    }
                    disabled={deletePromoterMutation.isPending}
                  >
                    {deletePromoterMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Ban className="h-4 w-4" />
                    )}
                    Deactivate Promoter
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="w-full bg-green-600 text-white hover:bg-green-700"
                    onClick={() =>
                      promoterId && restorePromoterMutation.mutate(promoterId)
                    }
                    disabled={restorePromoterMutation.isPending}
                  >
                    {restorePromoterMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Activate Promoter
                  </Button>
                )}
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
