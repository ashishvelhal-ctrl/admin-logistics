import { apiClient } from "@/lib/api";
import type {
  NetworkUser,
  NetworkPaginationMeta,
  NetworkUsersResponse,
  GetNetworkUsersParams,
  CreateNetworkUserPayload,
  UpdateNetworkUserPayload,
  UserProfileCompletionStatus,
  UserVehiclesResponse,
  UserTrip,
  UserTripsResponse,
  PaginationParams,
} from "../schema/networkTypes";

export type {
  NetworkUser,
  NetworkPaginationMeta,
  NetworkUsersResponse,
  GetNetworkUsersParams,
  CreateNetworkUserPayload,
  UpdateNetworkUserPayload,
  UserProfileCompletionStatus,
  UserVehiclesResponse,
  UserTrip,
  UserTripsResponse,
  PaginationParams,
};

const toPositiveInt = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

const toNonNegativeInt = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : fallback;
};

const normalizeResponseData = (response: any) => {
  const payload = response?.data;

  // Keep top-level response when data itself is the final list payload.
  if (Array.isArray(payload)) return response;

  // Unwrap one level when backend nests useful fields under data.
  if (payload && typeof payload === "object") return payload;

  return response;
};

const extractArrayData = (response: any): any[] => {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
};

const normalizeTrip = (trip: any): UserTrip => {
  const startLocation = trip?.startLocation ?? {};
  const endLocation = trip?.endLocation ?? {};

  const startPoint = startLocation?.point ?? {};
  const endPoint = endLocation?.point ?? {};

  const rawPrice = trip?.price ?? trip?.pricing?.amount;
  const parsedPrice = Number(rawPrice);

  return {
    ...trip,
    id: String(trip?.id ?? trip?._id ?? ""),
    date: String(trip?.date ?? trip?.pickupDate ?? trip?.createdAt ?? ""),
    time: String(trip?.time ?? trip?.pickupTimeSlot ?? ""),
    price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
    startLocation: {
      ...startLocation,
      address: String(startLocation?.address ?? ""),
      point: {
        lat: Number(startPoint?.lat ?? 0),
        lng: Number(startPoint?.lng ?? 0),
      },
    },
    endLocation: {
      ...endLocation,
      address: String(endLocation?.address ?? ""),
      point: {
        lat: Number(endPoint?.lat ?? 0),
        lng: Number(endPoint?.lng ?? 0),
      },
    },
  } as UserTrip;
};

interface RawPaginationMeta {
  total?: unknown;
  limit?: unknown;
  offset?: unknown;
  current_page?: unknown;
  total_pages?: unknown;
  has_next_page?: boolean;
  has_prev_page?: boolean;
}

const buildPaginationMeta = (
  rawMeta: RawPaginationMeta,
  items: unknown[],
  requestedLimit: number,
  requestedOffset: number,
): NetworkPaginationMeta => {
  const limit = toPositiveInt(rawMeta.limit, requestedLimit);
  const offset = toNonNegativeInt(rawMeta.offset, requestedOffset);
  const total = toNonNegativeInt(rawMeta.total, items.length);
  const totalPages = toPositiveInt(
    rawMeta.total_pages,
    Math.max(1, Math.ceil(total / Math.max(limit, 1))),
  );
  const currentPage = toPositiveInt(
    rawMeta.current_page,
    Math.floor(offset / Math.max(limit, 1)) + 1,
  );

  return {
    total,
    limit,
    offset,
    current_page: Math.min(currentPage, totalPages),
    total_pages: totalPages,
    has_next_page:
      typeof rawMeta.has_next_page === "boolean"
        ? rawMeta.has_next_page
        : currentPage < totalPages,
    has_prev_page:
      typeof rawMeta.has_prev_page === "boolean"
        ? rawMeta.has_prev_page
        : currentPage > 1,
  };
};

export const networkApi = {
  getUsers: async (
    params: GetNetworkUsersParams = {},
  ): Promise<NetworkUsersResponse> => {
    const queryParams = new URLSearchParams();

    if (params.limit !== undefined) {
      queryParams.append("limit", String(params.limit));
    }
    if (params.offset !== undefined) {
      queryParams.append("offset", String(params.offset));
    }
    if (params.search) {
      queryParams.append("search", params.search);
    }

    const url = queryParams.toString()
      ? `/promoter/users?${queryParams.toString()}`
      : "/promoter/users";

    const rawResponse = (await apiClient.get(url)) as any;
    const responseData = normalizeResponseData(rawResponse);
    const users = extractArrayData(responseData);

    const requestedLimit = toPositiveInt(params.limit, 10);
    const requestedOffset = toNonNegativeInt(params.offset, 0);

    return {
      message:
        responseData?.message ??
        rawResponse?.message ??
        "Users fetched successfully",
      data: users,
      paginationMeta: buildPaginationMeta(
        responseData?.paginationMeta ?? rawResponse?.paginationMeta ?? {},
        users,
        requestedLimit,
        requestedOffset,
      ),
    };
  },

  createUser: async (payload: CreateNetworkUserPayload) => {
    const response = await apiClient.post("/promoter/user", payload);
    return response;
  },

  updateUser: async (id: string, payload: UpdateNetworkUserPayload) => {
    const response = await apiClient.patch(`/promoter/user/${id}`, payload);
    return response;
  },

  getUserById: async (id: string): Promise<NetworkUser | null> => {
    const limit = 50;
    let offset = 0;
    let total = Number.POSITIVE_INFINITY;

    while (offset < total) {
      const response = await networkApi.getUsers({ limit, offset });
      const found = response.data.find(
        (user) => String(user.id) === String(id),
      );
      if (found) {
        return found;
      }

      total = response.paginationMeta.total;
      offset += limit;

      if (!response.paginationMeta.has_next_page) {
        break;
      }
    }

    return null;
  },

  getUserProfileCompletionStatus: async (
    id: string,
  ): Promise<UserProfileCompletionStatus> => {
    const rawResponse = (await apiClient.get(
      `/promoter/user/${id}/status`,
    )) as any;
    const responseData = normalizeResponseData(rawResponse);
    return (responseData?.data ?? responseData ?? {}) as UserProfileCompletionStatus;
  },

  getUserVehicles: async (
    id: string,
    params: { limit?: number; offset?: number } = {},
  ): Promise<UserVehiclesResponse> => {
    const queryParams = new URLSearchParams();
    if (params.limit !== undefined) {
      queryParams.append("limit", String(params.limit));
    }
    if (params.offset !== undefined) {
      queryParams.append("offset", String(params.offset));
    }
    const url = queryParams.toString()
      ? `/promoter/user/${id}/vehicles?${queryParams.toString()}`
      : `/promoter/user/${id}/vehicles`;

    const rawResponse = (await apiClient.get(url)) as any;
    const responseData = normalizeResponseData(rawResponse);
    const vehicles = extractArrayData(responseData);

    return {
      message:
        responseData?.message ??
        rawResponse?.message ??
        "Vehicles fetched successfully",
      data: vehicles,
      paginationMeta: buildPaginationMeta(
        responseData?.paginationMeta ?? rawResponse?.paginationMeta ?? {},
        vehicles,
        params.limit ?? 10,
        params.offset ?? 0,
      ),
    };
  },

  getUserTrips: async (
    id: string,
    params: { limit?: number; offset?: number } = {},
  ): Promise<UserTripsResponse> => {
    const queryParams = new URLSearchParams();
    const normalizedId = String(id ?? "").trim();
    if (params.limit !== undefined) {
      queryParams.append("limit", String(params.limit));
    }
    if (params.offset !== undefined) {
      queryParams.append("offset", String(params.offset));
    }
    if (normalizedId) {
      queryParams.append("userId", normalizedId);
    }
    const url = queryParams.toString()
      ? `/promoter/user/service-posts?${queryParams.toString()}`
      : "/promoter/user/service-posts";

    try {
      const rawResponse = (await apiClient.get(url)) as any;
      const responseData = normalizeResponseData(rawResponse);
      const trips = extractArrayData(responseData).map(normalizeTrip);

      return {
        message:
          responseData?.message ?? rawResponse?.message ?? "Trips fetched successfully",
        data: trips,
        paginationMeta: buildPaginationMeta(
          responseData?.paginationMeta ?? rawResponse?.paginationMeta ?? {},
          trips,
          params.limit ?? 10,
          params.offset ?? 0,
        ),
      };
    } catch (error: any) {
      if (
        error?.response?.status === 404 ||
        error?.message?.includes("not found")
      ) {
        return {
          message: "Trip history not available",
          data: [],
          paginationMeta: {
            total: 0,
            limit: params.limit ?? 10,
            offset: params.offset ?? 0,
            current_page: 1,
            total_pages: 1,
            has_next_page: false,
            has_prev_page: false,
          },
        };
      }
      throw error;
    }
  },

  getPromoterServicePosts: async (
    params: { limit?: number; offset?: number } = {},
  ): Promise<UserTripsResponse> => {
    const queryParams = new URLSearchParams();

    if (params.limit !== undefined) {
      queryParams.append("limit", String(params.limit));
    }
    if (params.offset !== undefined) {
      queryParams.append("offset", String(params.offset));
    }

    const url = queryParams.toString()
      ? `/promoter/user/service-posts?${queryParams.toString()}`
      : "/promoter/user/service-posts";

    try {
      const rawResponse = (await apiClient.get(url)) as any;
      const responseData = normalizeResponseData(rawResponse);
      const trips = extractArrayData(responseData).map(normalizeTrip);

      return {
        message:
          responseData?.message ?? rawResponse?.message ?? "Trips fetched successfully",
        data: trips,
        paginationMeta: buildPaginationMeta(
          responseData?.paginationMeta ?? rawResponse?.paginationMeta ?? {},
          trips,
          params.limit ?? 10,
          params.offset ?? 0,
        ),
      };
    } catch (error: any) {
      if (
        error?.response?.status === 404 ||
        error?.message?.includes("not found")
      ) {
        return {
          message: "Trip history not available",
          data: [],
          paginationMeta: {
            total: 0,
            limit: params.limit ?? 10,
            offset: params.offset ?? 0,
            current_page: 1,
            total_pages: 1,
            has_next_page: false,
            has_prev_page: false,
          },
        };
      }
      throw error;
    }
  },
};
