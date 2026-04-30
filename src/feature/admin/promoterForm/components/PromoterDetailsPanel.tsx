import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  type PromoterNetworkMember,
  type NetworkStatus,
} from "./PromoterNetworkTable";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginationWrapper as Pagination } from "@/components/common/Pagination";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { promoterApi } from "../services/promoterApi";

interface PromoterDetailsRightPanelProps {
  promoterId?: string;
  totalOnboard: number;
  totalEarnings: number;
  targetCurrent: number;
  targetTotal: number;
  networkMembers: PromoterNetworkMember[];
}

const PAGE_SIZE = 10;

const numberFormatter = new Intl.NumberFormat("en-IN");
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const statusLabelMap: Record<NetworkStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
};

const statusBadgeClassMap: Record<NetworkStatus, string> = {
  active: "bg-[#E4F7EC] text-[#2E715F]",
  inactive: "bg-[#FEF3C7] text-[#92400E]",
  pending: "bg-[#EEF2F6] text-[#64748B]",
};

const statusOptions: Array<{ value: "all" | NetworkStatus; label: string }> = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

export default function PromoterDetailsRightPanel({
  promoterId: promoterIdProp,
  totalOnboard,
  totalEarnings,
  targetCurrent,
  targetTotal,
  networkMembers: _networkMembers,
}: PromoterDetailsRightPanelProps) {
  const navigate = useNavigate();
  const { promoterId: promoterIdFromSearch } = useSearch({
    from: "/(admin)/promoterDetails",
  });
  const promoterId = promoterIdProp ?? promoterIdFromSearch;
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | NetworkStatus>(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchValue = useDebounce(searchValue, 300);
  const statusForApi =
    statusFilter === "inactive"
      ? "deactivated"
      : statusFilter === "pending"
        ? "all"
        : statusFilter;

  const { data: networkResponse, isLoading: isLoadingNetwork } = useQuery({
    queryKey: [
      "promoter-details-panel-network",
      promoterId,
      currentPage,
      debouncedSearchValue,
      statusForApi,
    ],
    queryFn: async () => {
      if (!promoterId) return { data: [], total: 0 };
      const offset = (currentPage - 1) * PAGE_SIZE;
      return promoterApi.getPromoterUsers(promoterId, {
        limit: PAGE_SIZE,
        offset,
        search: debouncedSearchValue || undefined,
        status: statusForApi,
      });
    },
    enabled: Boolean(promoterId),
    staleTime: 1000 * 30,
  });

  const paginatedMembers = useMemo(() => {
    const rawUsers = Array.isArray(networkResponse?.data) ? networkResponse.data : [];
    const mapped = rawUsers.map((member: any) => {
      const rawStatus = String(member?.profileStatus || "")
        .trim()
        .toLowerCase();
      const normalizedStatus: NetworkStatus =
        rawStatus === "pending"
          ? "pending"
          : rawStatus === "verified" ||
              rawStatus === "active" ||
              rawStatus === "phone_number_verified" ||
              rawStatus === "dl_verified" ||
              rawStatus === "profile_completed"
            ? "active"
            : "inactive";

      return {
        id: String(member?.id ?? member?._id ?? ""),
        name: String(member?.name ?? "Unknown"),
        phone: String(member?.phoneNumber ?? "N/A"),
        status: normalizedStatus,
      } as PromoterNetworkMember;
    });

    return statusFilter === "pending"
      ? mapped.filter((member) => member.status === "pending")
      : mapped;
  }, [networkResponse?.data, statusFilter]);

  const totalPages = Math.max(
    1,
    Number(
      Math.ceil(Number(networkResponse?.total ?? paginatedMembers.length) / PAGE_SIZE),
    ) || 1,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchValue, statusFilter, promoterId]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const progressValue =
    targetTotal > 0 ? Math.min((targetCurrent / targetTotal) * 100, 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Onboard</p>
            <p className="mt-1 text-3xl font-bold text-heading-color">
              {numberFormatter.format(totalOnboard)}
            </p>
            <p className="mt-1 text-sm font-medium text-icon-1-color">
              +12% this month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Earnings</p>
            <p className="mt-1 text-3xl font-bold text-heading-color">
              {currencyFormatter.format(totalEarnings)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Calculated weekly
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Target Goal</p>
            <p className="mt-1 text-3xl font-bold text-heading-color">
              {numberFormatter.format(targetCurrent)}
              <span className="text-base font-medium text-muted-foreground">
                {" "}
                / Month
              </span>
            </p>
            <div className="mt-3 h-2 w-full rounded-full bg-border-stroke">
              <div
                className="h-full rounded-full bg-icon-1-color"
                style={{ width: `${progressValue}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
            <h3 className="text-xl font-semibold text-heading-color">
              Promoter Network
            </h3>
            <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
              <div className="relative w-full sm:w-[240px]">
                <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search User"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="h-9 border-border-stroke bg-common-bg pl-9"
                />
              </div>

              <div className="w-full sm:w-[170px]">
                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as "all" | NetworkStatus)
                  }
                >
                  <SelectTrigger className="h-9 border-border-stroke bg-common-bg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="cursor-pointer"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#2E705F] text-left text-xs font-semibold uppercase tracking-wide text-white">
                <tr>
                  <th className="px-4 py-3">User Name</th>
                  <th className="px-4 py-3">Phone Number</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-5 text-center text-muted-foreground"
                      colSpan={3}
                    >
                      No users found for this filter.
                    </td>
                  </tr>
                ) : (
                  paginatedMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="border-t cursor-pointer hover:bg-common-bg/50"
                      onClick={() =>
                        navigate({
                          to: "/userDetails",
                          search: {
                            userId: String(member.id),
                            promoterId: promoterId ?? "1",
                          },
                        })
                      }
                    >
                      <td className="px-4 py-3 font-medium text-heading-color">
                        {member.name}
                      </td>
                      <td className="px-4 py-3 text-text-color">
                        {member.phone}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
                            statusBadgeClassMap[member.status],
                          )}
                        >
                          {statusLabelMap[member.status]}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-2 pt-2 md:flex-row md:items-center md:justify-between md:pt-3 lg:pt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      {isLoadingNetwork ? (
        <div className="text-xs text-muted-foreground">Loading filtered users...</div>
      ) : null}
    </div>
  );
}
