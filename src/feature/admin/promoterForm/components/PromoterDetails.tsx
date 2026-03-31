import { useNavigate, useSearch } from "@tanstack/react-router";
import { Ban } from "lucide-react";

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

const promoterProfiles: Record<string, PromoterProfile> = {
  "1": {
    id: "1",
    fullName: "Raj Sharma",
    mobileNumber: "9876543210",
    assignedAddress: "Pune",
    isActive: true,
    totalOnboard: 50,
    totalEarnings: 120,
    targetCurrent: 1200,
    targetTotal: 2000,
    networkMembers: [
      { id: 1, name: "Ramesh Patil", phone: "91234 56789", status: "completed" },
      { id: 2, name: "Suresh Yadav", phone: "92345 67890", status: "completed" },
      { id: 3, name: "Aman Singh", phone: "93456 78901", status: "pending" },
      { id: 4, name: "Vikas Pawar", phone: "94567 89012", status: "completed" },
      { id: 5, name: "Nitin Jadhav", phone: "95678 90123", status: "completed" },
      { id: 6, name: "Sanjay More", phone: "96789 01234", status: "completed" },
      { id: 7, name: "Vivek Nair", phone: "97890 12345", status: "inProgress" },
      { id: 8, name: "Ankit Sharma", phone: "98901 23456", status: "pending" },
      { id: 9, name: "Rohit Kumar", phone: "99012 34567", status: "completed" },
      { id: 10, name: "Amit Patel", phone: "99123 45678", status: "inProgress" },
      { id: 11, name: "Prajakta Deshmukh", phone: "99234 56789", status: "completed" },
      { id: 12, name: "Sachin Rane", phone: "99345 67890", status: "pending" },
    ],
  },
  "2": {
    id: "2",
    fullName: "Anita Verma",
    mobileNumber: "9988776655",
    assignedAddress: "Delhi",
    isActive: true,
    totalOnboard: 980,
    totalEarnings: 6500,
    targetCurrent: 8000,
    targetTotal: 12000,
    networkMembers: [
      { id: 21, name: "Priya Chauhan", phone: "90011 22334", status: "completed" },
      { id: 22, name: "Deepak Kumar", phone: "90022 33445", status: "inProgress" },
      { id: 23, name: "Sonal Gupta", phone: "90033 44556", status: "pending" },
      { id: 24, name: "Harish Yadav", phone: "90044 55667", status: "completed" },
    ],
  },
};

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
  const { promoterId } = useSearch({ from: "/(admin)/promoterDetails" });
  const promoter = promoterProfiles[promoterId ?? "1"];

  if (!promoter) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <div className="text-lg">Promoter not found</div>
        <Button type="button" variant="outline" onClick={() => navigate({ to: "/promoterList" })}>
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
        description="Onboard a new promoter to the secure vault network."
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
                <Button
                  type="button"
                  className="w-full bg-icon-2-color text-white hover:bg-icon-2-color/90"
                >
                  <Ban className="h-4 w-4" />
                  Deactivate Promoter
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="space-y-4 p-5">
              <h3 className="text-xl font-semibold text-heading-color">Status Tracking</h3>
              
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
