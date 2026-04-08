import { useState, useEffect } from "react";
import type {
  DLVerificationData,
  VehicleVerificationData,
} from "../types/verification.types";

export function useDLVerificationData() {
  const [verificationData, setVerificationData] =
    useState<DLVerificationData | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("dlVerificationData");
    if (storedData) {
      setVerificationData(JSON.parse(storedData));
    }
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "1800-01-01T00:00:00.000Z") return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return {
    verificationData,
    formatDate,
  };
}

export function useVehicleVerificationData() {
  const [verificationData, setVerificationData] =
    useState<VehicleVerificationData | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("vehicleVerificationData");
    if (storedData) {
      setVerificationData(JSON.parse(storedData));
    }
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "1800-01-01T00:00:00.000Z") return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return {
    verificationData,
    formatDate,
  };
}
