import { Plus } from "lucide-react";

import VehicleTable from "../VehicleTable";
import TripTable from "../TripTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StatsProps = {
  stats: {
    totalTrips: number;
    requirementPost: number;
    cancellationRate: number;
  };
  activeTab: "vehicles" | "trips";
  setActiveTab: (tab: "vehicles" | "trips") => void;
  vehiclePage: number;
  setVehiclePage: (page: number) => void;
  vehicleTotalPages: number;
  vehicles: any[];
  vehicleServerPaginated?: boolean;
  onVehicleClick?: (vehicle: any) => void;
  tripPage: number;
  setTripPage: (page: number) => void;
  userId: string;
  tripApiMode?: "promoter" | "admin";
  showAddVehicle?: boolean;
  onAddVehicle: () => void;
};

export default function PromoterUserStats({
  stats,
  activeTab,
  setActiveTab,
  vehiclePage,
  setVehiclePage,
  vehicleTotalPages,
  vehicles,
  vehicleServerPaginated = false,
  onVehicleClick,
  tripPage,
  setTripPage,
  userId,
  tripApiMode = "promoter",
  showAddVehicle = true,
  onAddVehicle,
}: StatsProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="border-border-stroke shadow-sm">
          <CardContent className="px-4 py-3">
            <p className="text-sm text-muted-foreground">Total Trips</p>
            <p className="text-3xl font-bold text-heading-color">
              {stats.totalTrips}
            </p>
            <p className="text-sm text-[#2F7D60]">+12% this month</p>
          </CardContent>
        </Card>
        <Card className="border-border-stroke shadow-sm">
          <CardContent className="px-4 py-3">
            <p className="text-sm text-muted-foreground">Requirement Post</p>
            <p className="text-3xl font-bold text-heading-color">
              {stats.requirementPost}
            </p>
            <p className="text-sm text-[#6FBF8D]">Calculated weekly</p>
          </CardContent>
        </Card>
        <Card className="border-border-stroke shadow-sm">
          <CardContent className="px-4 py-3">
            <p className="text-sm text-muted-foreground">Cancellation Rate</p>
            <p className="text-3xl font-bold text-heading-color">
              {stats.cancellationRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("vehicles")}
          className={cn(
            "h-10 rounded-md border text-sm font-semibold",
            activeTab === "vehicles"
              ? "border-icon-1-color bg-icon-1-color text-white"
              : "border-icon-1-color text-icon-1-color",
          )}
        >
          Vehicles List
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("trips")}
          className={cn(
            "h-10 rounded-md border text-sm font-semibold",
            activeTab === "trips"
              ? "border-icon-1-color bg-icon-1-color text-white"
              : "border-icon-1-color text-icon-1-color",
          )}
        >
          Trip History
        </button>
      </div>

      <Card className="overflow-hidden border-border-stroke shadow-sm">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-border-stroke bg-[#F8FAF9] px-5 py-4">
            <h3 className="text-xl font-semibold text-heading-color md:text-2xl">
              {activeTab === "vehicles"
                ? "Vehicle Details"
                : "User Trip History"}
            </h3>
            {activeTab === "vehicles" && showAddVehicle ? (
              <Button
                type="button"
                onClick={onAddVehicle}
                className="h-8 bg-icon-1-color px-3 text-xs text-white hover:bg-icon-1-color/90"
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add Vehicle
              </Button>
            ) : null}
          </div>

          {activeTab === "vehicles" ? (
            <VehicleTable
              vehicles={vehicles}
              currentPage={vehiclePage}
              onPageChange={setVehiclePage}
              totalPages={vehicleTotalPages}
              serverPaginated={vehicleServerPaginated}
              onVehicleClick={onVehicleClick}
            />
          ) : (
            <TripTable
              userId={userId}
              apiMode={tripApiMode}
              currentPage={tripPage}
              onPageChange={setTripPage}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
