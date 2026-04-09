import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { networkApi } from "@/feature/promoter/network/services/networkApi";
import type {
  LocationField,
  TripFormData,
  TripMapApplyPayload,
} from "../types/trip";

const INITIAL_FORM_DATA: TripFormData = {
  selectedUserId: "",
  vehicle: "",
  pickupLocation: "",
  dropLocation: "",
  pickupCoordinates: null,
  dropCoordinates: null,
  date: "",
  time: "",
  price: "",
  notes: "",
};

export function useCreateTripForm() {
  const [formData, setFormData] = useState<TripFormData>(INITIAL_FORM_DATA);
  const [userQuery, setUserQuery] = useState("");
  const [userOpen, setUserOpen] = useState(false);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [mapField, setMapField] = useState<LocationField>("pickup");

  const { data: usersResponse } = useQuery({
    queryKey: ["trip-create-users", userQuery],
    queryFn: () =>
      networkApi.getUsers({ limit: 100, offset: 0, search: userQuery }),
  });

  const { data: vehiclesResponse } = useQuery({
    queryKey: ["user-vehicles", formData.selectedUserId],
    queryFn: () =>
      networkApi.getUserVehicles(formData.selectedUserId, {
        limit: 100,
        offset: 0,
      }),
    enabled: !!formData.selectedUserId,
  });

  const userOptions = (usersResponse?.data ?? []).map((user) => ({
    value: String(user.id),
    label: `${user.name} (${user.phoneNumber})`,
  }));

  const vehicleOptions = (vehiclesResponse?.data ?? []).map((vehicle: any) => ({
    value: String(vehicle.id),
    label: `${vehicle.rcNumberData?.makerModel || "Choose Vehicle"} (${vehicle.rcNumber || "N/A"})`,
  }));

  const selectedUser = userOptions.find(
    (user) => user.value === formData.selectedUserId,
  );
  const selectedVehicle = vehicleOptions.find(
    (vehicle) => vehicle.value === formData.vehicle,
  );

  const setField = <K extends keyof TripFormData>(
    field: K,
    value: TripFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const setMapPayload = (payload: TripMapApplyPayload) => {
    setFormData((prev) => ({
      ...prev,
      pickupLocation: payload.pickupLocation,
      dropLocation: payload.dropLocation,
      pickupCoordinates: payload.pickupCoordinates,
      dropCoordinates: payload.dropCoordinates,
    }));
  };

  const selectUser = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedUserId: value,
      vehicle: "",
    }));
    setUserOpen(false);
  };

  const selectVehicle = (value: string) => {
    setFormData((prev) => ({ ...prev, vehicle: value }));
    setVehicleOpen(false);
  };

  const openMapForField = (field: LocationField) => {
    setMapField(field);
    setMapOpen(true);
  };

  return {
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
  };
}
