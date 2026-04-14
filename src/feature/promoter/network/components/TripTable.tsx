import { Ban, Loader2, Truck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { PaginationWrapper as Pagination } from "@/components/common/Pagination";
import { promoterApi } from "@/feature/admin/promoterForm/services/promoterApi";
import { formatDate } from "@/lib/format-utils";
import { cn } from "@/lib/utils";
import { networkApi, type UserTrip } from "../services/networkApi";

interface TripTableProps {
  userId: string;
  apiMode?: "promoter" | "admin";
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function TripTable({
  userId,
  apiMode = "promoter",
  currentPage,
  onPageChange,
}: TripTableProps) {
  const ITEMS_PER_PAGE = 5;

  const {
    data: tripsData,
    isLoading: isLoadingTrips,
    error: tripsError,
  } = useQuery({
    queryKey: ["userTrips", apiMode, userId, currentPage],
    queryFn: async () => {
      if (!userId) {
        return { data: [], paginationMeta: { total: 0, total_pages: 1 } };
      }

      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      if (apiMode === "admin") {
        return promoterApi.getAdminUserTrips(userId, {
          limit: ITEMS_PER_PAGE,
          offset,
        });
      }

      return networkApi.getUserTrips(userId, {
        limit: ITEMS_PER_PAGE,
        offset,
      });
    },
    enabled: !!userId,
  });

  const trips: UserTrip[] = Array.isArray(tripsData?.data) ? tripsData.data : [];
  const totalPages = tripsData?.paginationMeta?.total_pages || 1;

  const formatTripDate = (dateString: string) => {
    if (!dateString) return "-";
    return formatDate(dateString, {
      locale: "en-IN",
      invalidValue: dateString,
    });
  };

  const formatTripAmount = (amount: number | undefined) => {
    const safeAmount = Number.isFinite(amount) ? Number(amount) : 0;
    return `INR ${safeAmount.toLocaleString("en-IN")}`;
  };

  const getTripCity = (location?: { city?: string }) => {
    const city = String(location?.city || "").trim();
    return city || "-";
  };

  const getTripLabel = (trip: UserTrip) =>
    `${getTripCity(trip.startLocation)} -> ${getTripCity(trip.endLocation)}`;

  const getStatusDisplay = (status: unknown) => {
    const normalized = String(status || "pending").trim().toLowerCase();

    if (normalized === "active" || normalized === "completed") {
      return {
        label: "active",
        className: "bg-green-100 text-green-800",
      };
    }

    if (normalized === "pending" || normalized === "in_progress") {
      return {
        label: "pending",
        className: "bg-yellow-100 text-yellow-800",
      };
    }

    if (
      normalized === "inactive" ||
      normalized === "cancelled" ||
      normalized === "expired"
    ) {
      return {
        label: normalized === "expired" ? "inactive" : normalized,
        className: "bg-red-100 text-red-800",
      };
    }

    return {
      label: normalized || "pending",
      className: "bg-gray-100 text-gray-800",
    };
  };

  if (isLoadingTrips) {
    return (
      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg border border-border-stroke">
          <div className="bg-[#EEF2F5] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
            <div className="px-5 py-3">Date</div>
          </div>
          <div className="flex min-h-[250px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  if (tripsError) {
    return (
      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg border border-border-stroke">
          <div className="bg-[#EEF2F5] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
            <div className="px-5 py-3">Date</div>
          </div>
          <div className="flex min-h-[250px] flex-col items-center justify-center gap-2 text-center">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                <Ban className="h-7 w-7" />
              </div>
            </div>
            <p className="text-sm font-semibold text-red-600">
              Failed to load trips
            </p>
            <p className="max-w-sm text-xs text-muted-foreground">
              Unable to fetch trip data. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-border-stroke">
        <div className="bg-[#EEF2F5] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
          <div className="grid grid-cols-4 px-5 py-3">
            <div>Date</div>
            <div>Trip</div>
            <div>Status</div>
            <div>Amount</div>
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {trips.length === 0 ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center gap-2 text-center">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ECF1F0] text-[#9CB3AE]">
                  <Truck className="h-7 w-7" />
                </div>
                <Ban className="absolute -right-1 -bottom-1 h-4 w-4 text-[#B0B9C0]" />
              </div>
              <p className="text-sm font-semibold text-heading-color">
                No trips available
              </p>
              <p className="max-w-sm text-xs text-muted-foreground">
                This user hasn&apos;t been assigned any trips yet
              </p>
            </div>
          ) : (
            trips.map((trip: UserTrip, index: number) => {
              const statusInfo = getStatusDisplay(trip.status);

              return (
                <div
                  key={trip.id || index}
                  className="border-b border-border-stroke px-5 py-4 text-sm hover:bg-gray-50"
                >
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="font-semibold text-heading-color">
                        {formatTripDate(trip.date)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {trip.time || "-"}
                      </div>
                    </div>

                    <div className="text-muted-foreground">
                      {getTripLabel(trip)}
                    </div>

                    <div>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide",
                          statusInfo.className,
                        )}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="font-semibold text-heading-color">
                      {formatTripAmount(trip.price)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.max(1, totalPages)}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
