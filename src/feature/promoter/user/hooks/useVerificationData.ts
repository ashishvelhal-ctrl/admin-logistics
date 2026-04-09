import { useState, useEffect } from "react";

import { formatDate } from "@/lib/format-utils";
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

  return {
    verificationData,
    formatDate,
  };
}
