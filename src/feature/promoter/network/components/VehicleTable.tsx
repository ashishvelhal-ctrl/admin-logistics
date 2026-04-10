import { useMemo } from "react";
import { Ban, Truck, CheckCircle2, Clock } from "lucide-react";

import { PaginationWrapper as Pagination } from "@/components/common/Pagination";

interface VehicleTableProps {
  vehicles: any[];
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  serverPaginated?: boolean;
}

export default function VehicleTable({
  vehicles,
  currentPage,
  onPageChange,
  totalPages,
  serverPaginated = false,
}: VehicleTableProps) {
  const paginatedVehicles = useMemo(() => {
    if (serverPaginated) return vehicles;
    const ITEMS_PER_PAGE = 5;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return vehicles.slice(startIndex, endIndex);
  }, [vehicles, currentPage, serverPaginated]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden border border-border-stroke rounded-lg">
        <div className="grid grid-cols-3 bg-[#EEF2F5] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
          <div className="px-5 py-3">Vehicle Type</div>
          <div className="px-5 py-3">Vehicle Number</div>
          <div className="px-5 py-3">RC Status</div>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {vehicles.length === 0 ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center gap-2 text-center">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ECF1F0] text-[#9CB3AE]">
                  <Truck className="h-7 w-7" />
                </div>
                <Ban className="absolute -right-1 -bottom-1 h-4 w-4 text-[#B0B9C0]" />
              </div>
              <p className="text-sm font-semibold text-heading-color">
                No vehicles added yet
              </p>
              <p className="max-w-sm text-xs text-muted-foreground">
                This user hasn't added any vehicle details. Add a vehicle to
                continue onboarding or assign trips.
              </p>
            </div>
          ) : (
            paginatedVehicles.map((vehicle: any, index: number) => {
              const isRcVerified = vehicle.rcVerificationStatus === "verified";

              return (
                <div
                  key={index}
                  className="grid grid-cols-3 border-b border-border-stroke text-sm hover:bg-gray-50"
                >
                  <div className="px-5 py-4 font-semibold text-heading-color">
                    {vehicle.rcNumberData?.makerModel || "-"}
                  </div>
                  <div className="px-5 py-4 text-heading-color">
                    {vehicle.rcNumber || "-"}
                  </div>
                  <div className="px-5 py-4">
                    {isRcVerified ? (
                      <div className="flex items-center gap-1 text-[#2F7D60]">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs font-semibold">VERIFIED</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[#92400E]">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs font-semibold">PENDING</span>
                      </div>
                    )}
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
