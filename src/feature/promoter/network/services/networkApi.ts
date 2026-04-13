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

    const responseData = (await apiClient.get(url)) as any;
    const users = Array.isArray(responseData?.data) ? responseData.data : [];

    const requestedLimit = toPositiveInt(params.limit, 10);
    const requestedOffset = toNonNegativeInt(params.offset, 0);

    return {
      message: responseData?.message ?? "Users fetched successfully",
      data: users,
      paginationMeta: buildPaginationMeta(
        responseData?.paginationMeta ?? {},
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
    const responseData = (await apiClient.get(
      `/promoter/user/${id}/status`,
    )) as any;
    return (responseData?.data ?? {}) as UserProfileCompletionStatus;
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

    const responseData = (await apiClient.get(url)) as any;
    const vehicles = Array.isArray(responseData?.data) ? responseData.data : [];

    return {
      message: responseData?.message ?? "Vehicles fetched successfully",
      data: vehicles,
      paginationMeta: buildPaginationMeta(
        responseData?.paginationMeta ?? {},
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
      const responseData = (await apiClient.get(url)) as any;
      const trips = Array.isArray(responseData?.data) ? responseData.data : [];

      return {
        message: responseData?.message ?? "Trips fetched successfully",
        data: trips,
        paginationMeta: buildPaginationMeta(
          responseData?.paginationMeta ?? {},
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
