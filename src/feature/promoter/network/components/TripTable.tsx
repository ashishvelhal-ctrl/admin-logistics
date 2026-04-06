import { useMemo } from "react";
import { Ban, Truck } from "lucide-react";

import { PaginationWrapper as Pagination } from "@/components/common/Pagination";

interface TripTableProps {
  trips: any[];
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}

export default function TripTable({
  trips,
  currentPage,
  onPageChange,
  totalPages,
}: TripTableProps) {
  const paginatedTrips = useMemo(() => {
    const ITEMS_PER_PAGE = 5;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return trips.slice(startIndex, endIndex);
  }, [trips, currentPage]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden border border-border-stroke rounded-lg">
        <div className="bg-[#EEF2F5] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
          <div className="px-5 py-3">Date</div>
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
                This user hasn't been assigned any trips yet
              </p>
            </div>
          ) : (
            paginatedTrips.map((trip: any, index: number) => (
              <div
                key={index}
                className="border-b border-border-stroke px-5 py-4 text-sm hover:bg-gray-50"
              >
                <span className="font-semibold text-heading-color">
                  {trip.date || "-"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
