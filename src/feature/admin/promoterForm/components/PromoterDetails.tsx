import { useNavigate, useSearch } from "@tanstack/react-router";
import { Ban, Loader2, RefreshCw } from "lucide-react";

import { usePromoterDetails } from "../hooks/usePromoterDetails";
import PromoterNetworkTable, {
  type PromoterNetworkMember,
} from "./PromoterNetworkTable";

import StatusPieChart from "./StatusPieChart";
import PromoterContactInfo from "./PromoterContactInfo";

import { FormHeader } from "@/components/common/FormHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

  const {
    promoter,
    isLoadingPromoter,
    isLoadingUsers,
    promoterError,
    usersError,
    deletePromoterMutation,
    restorePromoterMutation,
  } = usePromoterDetails(promoterId);

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
                    className="w-full bg-[#2E705F] text-white hover:bg-[#2E705F]/90"
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
