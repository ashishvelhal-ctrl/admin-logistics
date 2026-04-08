import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { usePromoterServices } from "./usePromoterServices";

export function useCreateVehicle() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isLoading, createVehicle } = usePromoterServices();

  const [rcNumber, setRcNumber] = useState("");
  const [loadCapacity, setLoadCapacity] = useState("1-3.5 tons");
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>(
    [],
  );
  const [photoName, setPhotoName] = useState("");

  const toggleCapability = (capability: string) => {
    setSelectedCapabilities((prev) =>
      prev.includes(capability)
        ? prev.filter((item) => item !== capability)
        : [...prev, capability],
    );
  };

  const handlePickPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setPhotoName(file?.name || "");
  };

  const handleVerifyVehicle = async () => {
    if (!rcNumber) {
      alert("Please enter RC Number");
      return;
    }

    try {
      const thumbnailFile = fileInputRef.current?.files?.[0];
      const response = await createVehicle({
        rcNumber,
        loadCapacity,
        specialCapabilities: selectedCapabilities,
        thumbnailImage: thumbnailFile,
        additionalImages: [],
      });

      sessionStorage.setItem(
        "vehicleVerificationData",
        JSON.stringify({
          message: response.message,
          data: {
            vehicleNumber: rcNumber,
            status: "verified",
            verificationSource: "vehicle_creation",
            ...(response.data ?? {}),
          },
        }),
      );

      navigate({ to: "/verificationVehical" });
    } catch (error) {
      alert(
        "Vehicle verification failed. Please check your RC number and try again.",
      );
    }
  };

  return {
    rcNumber,
    setRcNumber,
    loadCapacity,
    setLoadCapacity,
    selectedCapabilities,
    photoName,
    fileInputRef,
    isLoading,
    toggleCapability,
    handlePickPhoto,
    handleFileChange,
    handleVerifyVehicle,
    navigate,
  };
}
