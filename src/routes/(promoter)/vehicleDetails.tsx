import { createFileRoute } from "@tanstack/react-router";

import VehicleDetailsPage from "@/feature/promoter/network/components/VehicleDetailsPage";

type VehicleDetailsMode = "promoter" | "admin";

interface VehicleDetailsSearch {
  userId?: string;
  vehicleId?: string;
  promoterId?: string;
  mode?: VehicleDetailsMode;
}

export const Route = createFileRoute("/(promoter)/vehicleDetails")({
  component: VehicleDetailsPage,
  validateSearch: (search: Record<string, unknown>): VehicleDetailsSearch => {
    const mode =
      search.mode === "admin" || search.mode === "promoter"
        ? search.mode
        : "promoter";

    return {
      userId: typeof search.userId === "string" ? search.userId : undefined,
      vehicleId:
        typeof search.vehicleId === "string" ? search.vehicleId : undefined,
      promoterId:
        typeof search.promoterId === "string" ? search.promoterId : undefined,
      mode,
    };
  },
});
