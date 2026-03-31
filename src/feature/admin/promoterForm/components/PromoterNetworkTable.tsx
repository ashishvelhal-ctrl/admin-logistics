import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Search } from "lucide-react";

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

export type NetworkStatus = "completed" | "pending" | "inProgress";

export interface PromoterNetworkMember {
  id: number;
  name: string;
  phone: string;
  status: NetworkStatus;
}

interface PromoterDetailsRightPanelProps {
  totalOnboard: number;
  totalEarnings: number;
  targetCurrent: number;
  targetTotal: number;
  networkMembers: PromoterNetworkMember[];
}

const PAGE_SIZE = 6;

const numberFormatter = new Intl.NumberFormat("en-IN");
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const statusLabelMap: Record<NetworkStatus, string> = {
  completed: "Completed",
  inProgress: "In Progress",
  pending: "Pending",
};

const statusBadgeClassMap: Record<NetworkStatus, string> = {
  completed: "bg-[#E4F7EC] text-[#2E715F]",
  inProgress: "bg-[#FEF3C7] text-[#92400E]",
  pending: "bg-[#EEF2F6] text-[#64748B]",
};

const statusOptions: Array<{ value: "all" | NetworkStatus; label: string }> = [
  { value: "all", label: "All Status" },
  { value: "completed", label: "Completed" },
  { value: "inProgress", label: "In Progress" },
  { value: "pending", label: "Pending" },
];

export default function PromoterDetailsRightPanel({
  totalOnboard,
  totalEarnings,
  targetCurrent,
  targetTotal,
  networkMembers,
}: PromoterDetailsRightPanelProps) {
  const navigate = useNavigate();
  const { promoterId } = useSearch({ from: "/(admin)/promoterDetails" });
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | NetworkStatus>(
    "all",
  );
  const [page, setPage] = useState(1);

  const filteredNetwork = useMemo(() => {
    return networkMembers.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        member.phone.includes(searchValue.trim());
      const matchesStatus =
        statusFilter === "all" || member.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [networkMembers, searchValue, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredNetwork.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    setPage(1);
  }, [searchValue, statusFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedMembers = filteredNetwork.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const progressValue =
    targetTotal > 0 ? Math.min((targetCurrent / targetTotal) * 100, 100) : 0;
  const startCount =
    filteredNetwork.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endCount = Math.min(currentPage * PAGE_SIZE, filteredNetwork.length);

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
            <h3 className="text-xl font-semibold text-heading-color">Promoter Network</h3>
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
                      <SelectItem key={option.value} value={option.value}>
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
              <thead className="bg-common-bg/70 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
        <p className="text-sm text-muted-foreground">
          {startCount}-{endCount} of {filteredNetwork.length}
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
