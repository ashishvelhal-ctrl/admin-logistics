import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { authAtom } from "@/atoms/authAtom";
import { FormHeader } from "@/components/common/FormHeader";
import { MobileProfileHeroCard } from "@/components/common/MobileProfileHeroCard";
import {
  MobileNetworkCardList,
  type MobileNetworkCardItem,
} from "@/components/common/MobileNetworkCardList";
import { MobileThreeStats } from "@/components/common/MobileThreeStats";
import { PaginationWrapper as Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import PromoterContactInfo from "@/feature/admin/promoterForm/components/PromoterContactInfo";
import PromoterNetworkTable, {
  type PromoterNetworkMember,
} from "@/feature/admin/promoterForm/components/PromoterNetworkTable";
import StatusPieChart from "@/feature/admin/promoterForm/components/StatusPieChart";
import { networkApi } from "@/feature/promoter/network/services/networkApi";

interface PromoterProfileData {
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
  const [mobileSearch, setMobileSearch] = useState("");
  const [mobilePage, setMobilePage] = useState(1);

  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["promoterProfileUsers"],
    queryFn: () => networkApi.getUsers({ limit: 100, offset: 0 }),
    staleTime: 1000 * 60 * 5,
  });

  let promoterUser = null;
  try {
    if (authState.user) {
      try {
        promoterUser = JSON.parse(authState.user);
      } catch {
        promoterUser = {
          name: authState.user,
          phoneNumber: null,
          address: null,
          id: null,
        };
      }
    }
  } catch (parseErr) {
    console.error("Failed to process auth user data:", parseErr);
    promoterUser = null;
  }

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "N/A";
    if (phone.startsWith("+91") && phone.length > 3) {
      return `+91 ${phone.slice(3)}`;
    }
    return phone;
  };

  const promoter: PromoterProfileData = {
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
    targetTotal: (usersData?.data?.length || 0) * 20 || 2000,
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

  const completedCount = getStatusCount(promoter.networkMembers, "completed");
  const inProgressCount = getStatusCount(promoter.networkMembers, "inProgress");
  const pendingCount = getStatusCount(promoter.networkMembers, "pending");
  const mobilePhoneDisplay = promoter.mobileNumber.startsWith("+91")
    ? promoter.mobileNumber
    : `+91 ${promoter.mobileNumber}`;
  const monthlyTarget = Math.max(150, promoter.targetCurrent || 0);

  const mobileNetworkMembers = useMemo(
    () =>
      promoter.networkMembers
        .filter((member) =>
          member.name.toLowerCase().includes(mobileSearch.toLowerCase()),
        )
        .slice(0, 1000),
    [promoter.networkMembers, mobileSearch],
  );
  const MOBILE_PAGE_SIZE = 6;
  const mobileTotalPages = Math.max(
    1,
    Math.ceil(mobileNetworkMembers.length / MOBILE_PAGE_SIZE),
  );
  const safeMobilePage = Math.min(mobilePage, mobileTotalPages);
  const pagedMobileMembers = mobileNetworkMembers.slice(
    (safeMobilePage - 1) * MOBILE_PAGE_SIZE,
    safeMobilePage * MOBILE_PAGE_SIZE,
  );
  const mobileCardItems: MobileNetworkCardItem[] = pagedMobileMembers.map(
    (member) => ({
      id: String(member.id),
      name: member.name,
      phone: member.phone,
      dateText: "OCT 24, 2023",
      locationText: "Maharashtra",
    }),
  );

  useEffect(() => {
    setMobilePage(1);
  }, [mobileSearch]);

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

  return (
    <div className="bg-common-bg pb-6 px-3 md:pr-10 md:pl-4">
      <section className="md:hidden space-y-4 pt-2">
        <MobileProfileHeroCard
          initials={getInitials(promoter.fullName)}
          name={promoter.fullName}
          phone={mobilePhoneDisplay}
          location={promoter.assignedAddress}
          onEdit={() =>
            navigate({
              to: "/editProfile",
              search: {
                fullName: promoter.fullName,
                mobileNumber: promoter.mobileNumber,
                assignedAddress: promoter.assignedAddress,
              },
            })
          }
        />

        <MobileThreeStats
          stats={[
            {
              label: "Total Onboard",
              value: promoter.totalOnboard.toLocaleString(),
              change: "+12% this month",
            },
            {
              label: "Total Earnings",
              value: `₹${promoter.totalEarnings.toLocaleString()}`,
              change: "+12% this month",
            },
            {
              label: "Target Goal",
              value: `${monthlyTarget}/Month`,
              change: "+12% this month",
            },
          ]}
        />

        <section>
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[28px] font-semibold text-heading-color">
              My Network
            </h3>
            <SlidersHorizontal className="w-4 h-4 text-inactive-text" />
          </div>
          <div className="mt-3 mb-3 relative">
            <Search className="w-4 h-4 text-inactive-text absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or number..."
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              className="w-full h-10 rounded-full border border-border-stroke bg-[#f1f4f3] pl-10 pr-3 text-sm outline-none"
            />
          </div>
          <MobileNetworkCardList
            items={mobileCardItems}
            size="compact"
            editStyle="icon"
            emptyMessage="No network users found."
            onEditClick={(item) => {
              const member = pagedMobileMembers.find(
                (m) => String(m.id) === item.id,
              );
              if (!member) return;
              navigate({
                to: "/editUser",
                search: {
                  userId: String(member.id),
                  name: member.name,
                  mobileNumber: member.phone,
                  address: promoter.assignedAddress,
                },
              });
            }}
          />
          <div className="pt-2">
            <Pagination
              currentPage={safeMobilePage}
              totalPages={mobileTotalPages}
              onPageChange={setMobilePage}
            />
          </div>
        </section>
      </section>

      <section className="hidden md:block">
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
      </section>
    </div>
  );
}
