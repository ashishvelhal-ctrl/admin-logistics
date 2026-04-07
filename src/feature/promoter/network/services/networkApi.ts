import { apiClient } from "@/lib/api";

export interface NetworkUser {
  id: string;
  name: string;
  phoneNumber: string;
  address?: string;
  profileStatus?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface NetworkPaginationMeta {
  total: number;
  limit: number;
  offset: number;
  current_page: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

export interface NetworkUsersResponse {
  message: string;
  data: NetworkUser[];
  paginationMeta: NetworkPaginationMeta;
}

export interface GetNetworkUsersParams {
  limit?: number;
  offset?: number;
  search?: string;
}

export interface CreateNetworkUserPayload {
  name: string;
  phoneNumber: string;
  address: string;
}

export interface UpdateNetworkUserPayload {
  name?: string;
  address?: string;
}

export interface UserProfileCompletionStatus {
  profileStatus?: string;
  completionPercentage?: number;
  isComplete?: boolean;
  isDrivingLicenseVerified?: boolean;
  [key: string]: any;
}

export interface UserVehiclesResponse {
  message: string;
  data: any[];
  paginationMeta: NetworkPaginationMeta;
}

export interface UserTrip {
  id: string;
  date: string;
  time: string;
  price: number;
  startLocation: {
    address: string;
    point: { lat: number; lng: number };
  };
  endLocation: {
    address: string;
    point: { lat: number; lng: number };
  };
  status?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface UserTripsResponse {
  message: string;
  data: UserTrip[];
  paginationMeta: NetworkPaginationMeta;
}

const toPositiveInt = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

const toNonNegativeInt = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : fallback;
};

const normalizeResponseData = (rawResponse: any) => {
  if (
    rawResponse &&
    typeof rawResponse === "object" &&
    rawResponse.data &&
    !Array.isArray(rawResponse.data) &&
    typeof rawResponse.data === "object"
  ) {
    return rawResponse.data;
  }
  return rawResponse;
};

export const networkApi = {
  // GET /promoter/users
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
    const normalizedResponse =
      rawResponse &&
      typeof rawResponse === "object" &&
      rawResponse.data &&
      !Array.isArray(rawResponse.data) &&
      Array.isArray(rawResponse.data.data)
        ? rawResponse.data
        : rawResponse;

    const users = Array.isArray(normalizedResponse?.data)
      ? normalizedResponse.data
      : Array.isArray(rawResponse?.data)
        ? rawResponse.data
        : [];

    const requestedLimit = toPositiveInt(params.limit, 10);
    const requestedOffset = toNonNegativeInt(params.offset, 0);
    const rawPaginationMeta = normalizedResponse?.paginationMeta ?? {};
    const total = toNonNegativeInt(rawPaginationMeta.total, users.length);
    const limit = toPositiveInt(rawPaginationMeta.limit, requestedLimit);
    const offset = toNonNegativeInt(rawPaginationMeta.offset, requestedOffset);
    const totalPages = toPositiveInt(
      rawPaginationMeta.total_pages,
      Math.max(1, Math.ceil(total / limit)),
    );
    const currentPage = toPositiveInt(
      rawPaginationMeta.current_page,
      Math.floor(offset / limit) + 1,
    );

    return {
      message:
        normalizedResponse?.message ??
        rawResponse?.message ??
        "Users fetched successfully",
      data: users,
      paginationMeta: {
        total,
        limit,
        offset,
        current_page: Math.min(currentPage, totalPages),
        total_pages: totalPages,
        has_next_page:
          typeof rawPaginationMeta.has_next_page === "boolean"
            ? rawPaginationMeta.has_next_page
            : currentPage < totalPages,
        has_prev_page:
          typeof rawPaginationMeta.has_prev_page === "boolean"
            ? rawPaginationMeta.has_prev_page
            : currentPage > 1,
      },
    };
  },

  // POST /promoter/user
  createUser: async (payload: CreateNetworkUserPayload) => {
    const response = await apiClient.post("/promoter/user", payload);
    return response;
  },

  // PATCH /promoter/user/:id
  updateUser: async (id: string, payload: UpdateNetworkUserPayload) => {
    const response = await apiClient.patch(`/promoter/user/${id}`, payload);
    return response;
  },

  // Backend does not expose GET /promoter/user/:id.
  // We resolve user details by walking paginated /promoter/users.
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

  // GET /promoter/user/:id/status
  getUserProfileCompletionStatus: async (
    id: string,
  ): Promise<UserProfileCompletionStatus> => {
    const rawResponse = (await apiClient.get(
      `/promoter/user/${id}/status`,
    )) as any;
    const normalized = normalizeResponseData(rawResponse);
    return (normalized?.data ??
      normalized ??
      {}) as UserProfileCompletionStatus;
  },

  // GET /promoter/user/:id/vehicles
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
    const normalizedResponse = normalizeResponseData(rawResponse);
    const vehicles = Array.isArray(normalizedResponse?.data)
      ? normalizedResponse.data
      : Array.isArray(rawResponse?.data)
        ? rawResponse.data
        : [];

    const rawPaginationMeta = normalizedResponse?.paginationMeta ?? {};
    const limit = toPositiveInt(rawPaginationMeta.limit, params.limit ?? 10);
    const offset = toNonNegativeInt(
      rawPaginationMeta.offset,
      params.offset ?? 0,
    );
    const total = toNonNegativeInt(rawPaginationMeta.total, vehicles.length);
    const totalPages = toPositiveInt(
      rawPaginationMeta.total_pages,
      Math.max(1, Math.ceil(total / Math.max(limit, 1))),
    );
    const currentPage = toPositiveInt(
      rawPaginationMeta.current_page,
      Math.floor(offset / Math.max(limit, 1)) + 1,
    );

    return {
      message:
        normalizedResponse?.message ??
        rawResponse?.message ??
        "Vehicles fetched successfully",
      data: vehicles,
      paginationMeta: {
        total,
        limit,
        offset,
        current_page: Math.min(currentPage, totalPages),
        total_pages: totalPages,
        has_next_page:
          typeof rawPaginationMeta.has_next_page === "boolean"
            ? rawPaginationMeta.has_next_page
            : currentPage < totalPages,
        has_prev_page:
          typeof rawPaginationMeta.has_prev_page === "boolean"
            ? rawPaginationMeta.has_prev_page
            : currentPage > 1,
      },
    };
  },

  // GET /promoter/user/service-posts (get trips for specific user under current promoter)
  getUserTrips: async (
    id: string,
    params: { limit?: number; offset?: number } = {},
  ): Promise<UserTripsResponse> => {
    const queryParams = new URLSearchParams();
    if (params.limit !== undefined) {
      queryParams.append("limit", String(params.limit));
    }
    if (params.offset !== undefined) {
      queryParams.append("offset", String(params.offset));
    }
    if (id) {
      queryParams.append("userId", id);
    }
    const url = queryParams.toString()
      ? `/promoter/user/service-posts?${queryParams.toString()}`
      : `/promoter/user/service-posts?userId=${id}`;

    try {
      const rawResponse = (await apiClient.get(url)) as any;

      const normalizedResponse = normalizeResponseData(rawResponse);
      const trips = Array.isArray(normalizedResponse?.data)
        ? normalizedResponse.data
        : Array.isArray(rawResponse?.data)
          ? rawResponse.data
          : [];

      const rawPaginationMeta = normalizedResponse?.paginationMeta ?? {};
      const limit = toPositiveInt(rawPaginationMeta.limit, params.limit ?? 10);
      const offset = toNonNegativeInt(
        rawPaginationMeta.offset,
        params.offset ?? 0,
      );
      const total = toNonNegativeInt(rawPaginationMeta.total, trips.length);
      const totalPages = toPositiveInt(
        rawPaginationMeta.total_pages,
        Math.max(1, Math.ceil(total / Math.max(limit, 1))),
      );
      const currentPage = toPositiveInt(
        rawPaginationMeta.current_page,
        Math.floor(offset / Math.max(limit, 1)) + 1,
      );

      return {
        message:
          normalizedResponse?.message ??
          rawResponse?.message ??
          "Trips fetched successfully",
        data: trips,
        paginationMeta: {
          total,
          limit,
          offset,
          current_page: Math.min(currentPage, totalPages),
          total_pages: totalPages,
          has_next_page:
            typeof rawPaginationMeta.has_next_page === "boolean"
              ? rawPaginationMeta.has_next_page
              : currentPage < totalPages,
          has_prev_page:
            typeof rawPaginationMeta.has_prev_page === "boolean"
              ? rawPaginationMeta.has_prev_page
              : currentPage > 1,
        },
      };
    } catch (error: any) {
      // If endpoint doesn't exist, return empty data
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
