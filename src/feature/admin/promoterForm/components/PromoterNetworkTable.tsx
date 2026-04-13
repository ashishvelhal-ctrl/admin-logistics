import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { useDebounce } from "@/hooks/use-debounce";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginationWrapper as Pagination } from "@/components/common/Pagination";
import { cn } from "@/lib/utils";

export type NetworkStatus = "active" | "inactive" | "pending";
type TableView = "network" | "trips";

export interface PromoterNetworkMember {
  id: string;
  name: string;
  phone: string;
  status: NetworkStatus;
}

export interface PromoterTripRow {
  id: string;
  name: string;
  secondary: string;
  status: NetworkStatus;
}

interface PromoterDetailsRightPanelProps {
  promoterId: string;
  userDetailsRoute?: "/userDetails" | "/promoterUserDetails";
  totalOnboard: number;
  totalCreatedTrips: number;
  totalEarnings: number;
  targetCurrent: number;
  targetTotal: number;
  networkMembers: PromoterNetworkMember[];
  tripRows: PromoterTripRow[];
}

const PAGE_SIZE = 6;

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
  inactive: "bg-[#FEF2F2] text-[#DC2626]",
  pending: "bg-[#EEF2F6] text-[#64748B]",
};

const statusOptions: Array<{ value: "all" | NetworkStatus; label: string }> = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

export default function PromoterDetailsRightPanel({
  promoterId,
  userDetailsRoute = "/userDetails",
  totalOnboard,
  totalEarnings,
  targetCurrent,
  targetTotal,
  networkMembers,
  tripRows,
}: PromoterDetailsRightPanelProps) {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 300);
  const [statusFilter, setStatusFilter] = useState<"all" | NetworkStatus>(
    "all",
  );
  const [activeView, setActiveView] = useState<TableView>("network");
  const [page, setPage] = useState(1);

  const tableRows = useMemo(() => {
    if (activeView === "network") {
      return networkMembers.map((member) => ({
        id: member.id,
        name: member.name,
        secondary: member.phone,
        status: member.status,
      }));
    }

    return tripRows;
  }, [activeView, networkMembers, tripRows]);

  const filteredRows = useMemo(() => {
    return tableRows.filter((row) => {
      const matchesSearch =
        row.name.toLowerCase().includes(debouncedSearchValue.toLowerCase()) ||
        row.secondary
          .toLowerCase()
          .includes(debouncedSearchValue.trim().toLowerCase());
      const matchesStatus =
        statusFilter === "all" || row.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tableRows, debouncedSearchValue, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchValue, statusFilter, activeView]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-10 border-icon-1-color",
            activeView === "network"
              ? "bg-icon-1-color text-white hover:bg-icon-1-color/90 hover:text-white"
              : "text-icon-1-color hover:bg-icon-1-color/10",
          )}
          onClick={() => setActiveView("network")}
        >
          Promoter Network
        </Button>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-10 border-icon-1-color",
            activeView === "trips"
              ? "bg-icon-1-color text-white hover:bg-icon-1-color/90 hover:text-white"
              : "text-icon-1-color hover:bg-icon-1-color/10",
          )}
          onClick={() => setActiveView("trips")}
        >
          Total Created Trips
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
            <h3 className="text-xl font-semibold text-heading-color">
              {activeView === "network"
                ? "Promoter Network"
                : "Total Created Trips"}
            </h3>
            <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
              <div className="relative w-full sm:w-[240px]">
                <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={
                    activeView === "network" ? "Search User" : "Search Trip"
                  }
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
                  <th className="px-4 py-3">
                    {activeView === "network" ? "User Name" : "Trip Name"}
                  </th>
                  <th className="px-4 py-3">
                    {activeView === "network" ? "Phone Number" : "Created By"}
                  </th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-5 text-center text-muted-foreground"
                      colSpan={3}
                    >
                      No records found for this filter.
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => (
                    <tr
                      key={row.id}
                      className={cn(
                        "border-t",
                        activeView === "network" &&
                          "cursor-pointer hover:bg-common-bg/50",
                      )}
                      onClick={() =>
                        activeView === "network" &&
                        navigate({
                          to: userDetailsRoute,
                          search: {
                            userId: String(row.id),
                            promoterId: promoterId ?? "1",
                          },
                        })
                      }
                    >
                      <td className="px-4 py-3 font-medium text-heading-color">
                        {row.name}
                      </td>
                      <td className="px-4 py-3 text-text-color">
                        {row.secondary}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
                            statusBadgeClassMap[row.status],
                          )}
                        >
                          {statusLabelMap[row.status]}
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

      <div className="flex justify-end pt-2 md:pt-3 lg:pt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
