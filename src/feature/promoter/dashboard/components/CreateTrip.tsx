import { useNavigate } from "@tanstack/react-router";
import type { ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";
import { FormActionRow } from "@/components/common/FormActionRow";
import { toastService } from "@/lib/toast";
import { useCreateTripForm } from "../hooks/useCreateTripForm";
import { useCreateTrip } from "../hooks/useCreateTrip";
import type { CreateTripPayload } from "../services/tripApi";
import type { TripFormData } from "../types/trip";
import AssignTripSection from "./create-trip/AssignTripSection";
import TripDetailsSection from "./create-trip/TripDetailsSection";
import TripMapPicker from "./TripMapPicker";

const buildCreateTripPayload = (formData: TripFormData): CreateTripPayload => ({
  userId: formData.selectedUserId,
  vehicleId: formData.vehicle,
  startLocation: {
    address: formData.pickupLocation.trim(),
    point: {
      lat: formData.pickupCoordinates?.lat ?? 0,
      lng: formData.pickupCoordinates?.lng ?? 0,
    },
  },
  endLocation: {
    address: formData.dropLocation.trim(),
    point: {
      lat: formData.dropCoordinates?.lat ?? 0,
      lng: formData.dropCoordinates?.lng ?? 0,
    },
  },
  date: formData.date,
  time: formData.time,
  price: Number(formData.price),
  notes: formData.notes.trim() || undefined,
});

export default function CreateTrip() {
  const navigate = useNavigate();
  const createTripMutation = useCreateTrip();
  const {
    formData,
    mapOpen,
    setMapOpen,
    mapField,
    userQuery,
    setUserQuery,
    userOpen,
    setUserOpen,
    vehicleOpen,
    setVehicleOpen,
    userOptions,
    vehicleOptions,
    selectedUser,
    selectedVehicle,
    setField,
    setMapPayload,
    selectUser,
    selectVehicle,
    openMapForField,
  } = useCreateTripForm();

  const handleInputChange =
    (field: keyof TripFormData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setField(field, event.target.value as TripFormData[typeof field]);
    };

  const handleCreateTrip = async () => {
    if (!formData.selectedUserId || !formData.vehicle) {
      toastService.error("Please select both user and vehicle");
      return;
    }

    if (!formData.pickupLocation || !formData.dropLocation) {
      toastService.error("Please select pickup and drop locations");
      return;
    }

    if (!formData.pickupCoordinates || !formData.dropCoordinates) {
      toastService.error("Please confirm pickup and drop on the map");
      return;
    }

    if (!formData.date || !formData.time || !formData.price.trim()) {
      toastService.error("Please complete date, time, and price");
      return;
    }

    const price = Number(formData.price);
    if (!Number.isFinite(price) || price <= 0) {
      toastService.error("Please enter a valid price");
      return;
    }

    try {
      await createTripMutation.mutateAsync(buildCreateTripPayload(formData));
      toastService.success("Trip created successfully");
      navigate({ to: "/dashboardp" });
    } catch (error) {
      toastService.error(
        error instanceof Error ? error.message : "Failed to create trip",
      );
    }
  };

  return (
    <main className="min-h-full bg-common-bg pr-4 pl-3 pt-1 pb-3">
      <TripMapPicker
        open={mapOpen}
        onOpenChange={setMapOpen}
        targetField={mapField}
        initialPickup={formData.pickupLocation}
        initialDrop={formData.dropLocation}
        initialPickupCoordinates={formData.pickupCoordinates}
        initialDropCoordinates={formData.dropCoordinates}
        onApply={setMapPayload}
      />

      <section className="mx-2 mt-4 flex flex-col gap-6">
        <PageHeader
          title="Create Trip"
          description="Assign a trip between a customer and a driver"
        />

        <AssignTripSection
          userOpen={userOpen}
          vehicleOpen={vehicleOpen}
          setUserOpen={setUserOpen}
          setVehicleOpen={setVehicleOpen}
          userQuery={userQuery}
          setUserQuery={setUserQuery}
          userOptions={userOptions}
          vehicleOptions={vehicleOptions}
          selectedUserLabel={selectedUser?.label}
          selectedVehicleLabel={selectedVehicle?.label}
          selectedUserId={formData.selectedUserId}
          selectedVehicleId={formData.vehicle}
          onUserSelect={selectUser}
          onVehicleSelect={selectVehicle}
        />

        <TripDetailsSection
          formData={formData}
          onInputChange={handleInputChange}
          onOpenMap={openMapForField}
        />

        <div className="grid grid-cols-2 gap-3 md:hidden">
          <Button
            type="button"
            onClick={handleCreateTrip}
            disabled={createTripMutation.isPending}
            className="h-12 rounded-xl bg-icon-1-color text-white hover:bg-icon-1-color/90"
          >
            {createTripMutation.isPending ? "Creating..." : "Create Trip"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/dashboardp" })}
            className="h-12 rounded-xl border-icon-1-color text-icon-1-color hover:bg-icon-1-color/5"
          >
            Cancel
          </Button>
        </div>

        <div className="hidden md:block">
          <FormActionRow
            primaryType="button"
            primaryLabel="Create Trip"
            loadingLabel="Creating..."
            isLoading={createTripMutation.isPending}
            onPrimaryClick={handleCreateTrip}
            onCancel={() => navigate({ to: "/dashboardp" })}
          />
        </div>
      </section>
    </main>
  );
}
