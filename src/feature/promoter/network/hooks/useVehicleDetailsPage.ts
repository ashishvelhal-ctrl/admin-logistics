import { useMemo } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { formatDate, sentenceWords } from "@/lib/format-utils";
import { networkApi } from "../services/networkApi";
import { promoterApi } from "@/feature/admin/promoterForm/services/promoterApi";

type VehicleDetailsMode = "promoter" | "admin";

type VehicleDetailsSearch = {
  userId?: string;
  vehicleId?: string;
  promoterId?: string;
  mode?: VehicleDetailsMode;
};

const EMPTY_VALUE = "-";

const toDisplayValue = (value: unknown): string => {
  if (value === null || value === undefined || value === "") return EMPTY_VALUE;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    const cleaned = value
      .map((item) => {
        if (typeof item === "string" || typeof item === "number") {
          return String(item);
        }
        return "";
      })
      .filter(Boolean);
    return cleaned.length ? cleaned.join(", ") : EMPTY_VALUE;
  }
  return String(value);
};

const buildVehicleMetaRows = (vehicle: any) => {
  const rcData = vehicle?.rcNumberData ?? {};

  return [
    {
      label: "Vehicle Type",
      value: toDisplayValue(
        vehicle?.vehicleType ?? rcData?.vehicleType ?? rcData?.vehicleCategory,
      ),
    },
    {
      label: "Load Capacity",
      value: toDisplayValue(
        vehicle?.loadCapacity ?? rcData?.grossVehicleWeight,
      ),
    },
    {
      label: "Fuel Type",
      value: toDisplayValue(vehicle?.fuelType ?? rcData?.fuelType),
    },
    {
      label: "Manufacturer",
      value: toDisplayValue(
        vehicle?.manufacturer ?? rcData?.makerDescription ?? rcData?.makerModel,
      ),
    },
    {
      label: "Registration Date",
      value: toDisplayValue(
        vehicle?.registrationDate ??
          rcData?.registrationDate ??
          (vehicle?.createdAt ? formatDate(vehicle.createdAt) : EMPTY_VALUE),
      ),
    },
    {
      label: "Owner Name",
      value: toDisplayValue(vehicle?.ownerName ?? rcData?.ownerName),
    },
    {
      label: "Color",
      value: toDisplayValue(vehicle?.color ?? rcData?.color),
    },
    {
      label: "Special Capabilities",
      value: toDisplayValue(vehicle?.specialCapabilities),
    },
  ];
};

const getImageUrl = (value: any): string | null => {
  if (!value) return null;
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "object") {
    const possible =
      value.url ?? value.path ?? value.secure_url ?? value.location;
    if (typeof possible === "string" && possible.trim()) return possible;
  }
  return null;
};

const collectImageUrls = (vehicle: any): string[] => {
  const urls = new Set<string>();

  const thumbnail = getImageUrl(vehicle?.thumbnailImage);
  if (thumbnail) urls.add(thumbnail);

  const additionalImages = Array.isArray(vehicle?.additionalImages)
    ? vehicle.additionalImages
    : [];

  for (const imageItem of additionalImages) {
    const imageUrl = getImageUrl(imageItem);
    if (imageUrl) urls.add(imageUrl);
  }

  return Array.from(urls);
};

const normalizeVehicles = (rawVehicles: any[]) =>
  rawVehicles.map((vehicle: any) => ({
    ...vehicle,
    vehicleType:
      vehicle.vehicleType ??
      vehicle.type ??
      vehicle.rcNumberData?.makerModel ??
      vehicle.loadCapacity ??
      vehicle.model ??
      EMPTY_VALUE,
    vehicleNumber:
      vehicle.vehicleNumber ??
      vehicle.registrationNumber ??
      vehicle.number ??
      vehicle.rcNumber ??
      EMPTY_VALUE,
    vehicleRc:
      vehicle.vehicleRc ?? vehicle.rcNumber ?? vehicle.rc ?? EMPTY_VALUE,
  }));

const getVehicleStatus = (vehicle: any) => {
  const rcStatus = String(
    vehicle?.rcVerificationStatus ?? vehicle?.verificationStatus ?? "",
  ).toLowerCase();

  if (rcStatus === "verified") {
    return { label: "Verified", verified: true };
  }

  if (rcStatus === "pending") {
    return { label: "Pending", verified: false };
  }

  return {
    label: vehicle?.rcNumberData ? "Verified" : "Pending",
    verified: Boolean(vehicle?.rcNumberData),
  };
};

const extractPrimitiveFields = (value: Record<string, unknown>) => {
  return Object.entries(value)
    .filter(([, fieldValue]) => {
      return (
        typeof fieldValue === "string" ||
        typeof fieldValue === "number" ||
        typeof fieldValue === "boolean"
      );
    })
    .map(([key, fieldValue]) => ({
      label: sentenceWords(key),
      value: toDisplayValue(fieldValue),
    }));
};

export function useVehicleDetailsPage() {
  const navigate = useNavigate();
  const {
    userId,
    vehicleId,
    promoterId,
    mode = "promoter",
  } = useSearch({
    from: "/(promoter)/vehicleDetails",
  }) as VehicleDetailsSearch;

  const {
    data: userDetails,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ["vehicleDetailsUser", mode, userId, promoterId],
    queryFn: async () => {
      if (!userId) return null;
      if (mode === "admin") {
        if (promoterId) {
          return promoterApi.getPromoterUserById(promoterId, userId);
        }
        return promoterApi.getAdminUserById(userId);
      }
      return networkApi.getUserById(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: vehiclesResponse,
    isLoading: isVehiclesLoading,
    error: vehiclesError,
  } = useQuery({
    queryKey: ["vehicleDetailsVehicles", mode, userId],
    queryFn: async () => {
      if (!userId) return null;
      if (mode === "admin") {
        return promoterApi.getAdminUserVehicles(userId, {
          limit: 100,
          offset: 0,
        });
      }
      return networkApi.getUserVehicles(userId, { limit: 100, offset: 0 });
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });

  const vehicles = useMemo(
    () => normalizeVehicles(vehiclesResponse?.data ?? []),
    [vehiclesResponse?.data],
  );

  const selectedVehicle = useMemo(() => {
    if (!vehicleId) return null;
    return (
      vehicles.find((vehicle: any) =>
        [
          vehicle.id,
          vehicle._id,
          vehicle.vehicleId,
          vehicle.vehicleNumber,
          vehicle.rcNumber,
          vehicle.vehicleRc,
        ]
          .filter(Boolean)
          .some((idValue) => String(idValue) === String(vehicleId)),
      ) ?? null
    );
  }, [vehicles, vehicleId]);

  const isLoading = isUserLoading || isVehiclesLoading;
  const error = userError || vehiclesError;

  const statusInfo = getVehicleStatus(selectedVehicle);
  const vehicleImages = collectImageUrls(selectedVehicle);
  const metadataRows = useMemo(
    () => buildVehicleMetaRows(selectedVehicle),
    [selectedVehicle],
  );

  const additionalInfo = useMemo(() => {
    if (!selectedVehicle) return [];

    const excludedKeys = new Set([
      "id",
      "_id",
      "vehicleId",
      "vehicleType",
      "vehicleNumber",
      "vehicleRc",
      "rcNumberData",
      "thumbnailImage",
      "additionalImages",
      "specialCapabilities",
    ]);

    const topLevelFields = extractPrimitiveFields(
      Object.fromEntries(
        Object.entries(selectedVehicle).filter(
          ([key]) => !excludedKeys.has(key),
        ),
      ),
    );

    const rcFields = selectedVehicle.rcNumberData
      ? extractPrimitiveFields(selectedVehicle.rcNumberData)
      : [];

    const dedup = new Set<string>();
    const allRows = [...topLevelFields, ...rcFields].filter((row) => {
      const dedupKey = `${row.label}-${row.value}`;
      if (dedup.has(dedupKey)) return false;
      dedup.add(dedupKey);
      return row.value !== EMPTY_VALUE;
    });

    return allRows.slice(0, 16);
  }, [selectedVehicle]);

  const goBack = () => {
    if (mode === "admin") {
      navigate({
        to: "/userDetails",
        search: {
          userId: userId ?? "",
          promoterId: promoterId ?? "",
        },
      });
      return;
    }

    navigate({
      to: "/promoterUserDetails",
      search: { userId: userId ?? "" },
    });
  };

  const displayModel = toDisplayValue(
    selectedVehicle?.rcNumberData?.makerModel ?? selectedVehicle?.vehicleType,
  );

  return {
    userId,
    vehicleId,
    userDetails,
    selectedVehicle,
    statusInfo,
    vehicleImages,
    metadataRows,
    additionalInfo,
    displayModel,
    isLoading,
    error,
    goBack,
    emptyValue: EMPTY_VALUE,
  };
}
