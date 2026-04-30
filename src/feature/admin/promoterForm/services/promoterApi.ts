import { apiClient } from "@/lib/api";
import type {
  PromoterListParams,
  PromoterListResponse,
  PromoterMutationPayload,
  RolesResponse,
  UserObject,
} from "../schema/promoterSchema";

export type {
  PaginationMeta,
  PromoterListParams,
  PromoterListResponse,
  PromoterMutationPayload,
  RolesResponse,
  UserObject,
} from "../schema/promoterSchema";

export interface PromoterServicePostLocation {
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  point?: {
    lat?: number;
    lng?: number;
  };
}

export interface PromoterServicePost {
  id?: string;
  _id?: string;
  postId?: string | number;
  status?: string;
  startLocation?: PromoterServicePostLocation;
  endLocation?: PromoterServicePostLocation;
}

export interface PromoterServicePostGroup {
  user?: {
    id?: string;
    name?: string;
    phoneNumber?: string;
    promoter?: string;
  };
  servicePosts?: PromoterServicePost[];
}

const toPositiveInt = (value: unknown, fallback: number): number => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) && parsedValue > 0
    ? Math.floor(parsedValue)
    : fallback;
};

const toNonNegativeInt = (value: unknown, fallback: number): number => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) && parsedValue >= 0
    ? Math.floor(parsedValue)
    : fallback;
};

const buildCreatePromoterBody = (payload: PromoterMutationPayload) => ({
  name: payload.name,
  address: payload.address,
  phoneNumber: payload.phoneNumber,
});

const buildUpdatePromoterBody = (payload: PromoterMutationPayload) => ({
  name: payload.name,
  address: payload.address,
});

const normalizeResponseData = (response: any) => response?.data ?? response;

const normalizeTrip = (trip: any) => {
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
  };
};

export const promoterApi = {
  // Fetch promoter list with pagination and search
  getPromoters: async (
    params: PromoterListParams = {},
  ): Promise<PromoterListResponse> => {
    const queryParams = new URLSearchParams();

    if (params.limit !== undefined)
      queryParams.append("limit", params.limit.toString());
    if (params.offset !== undefined)
      queryParams.append("offset", params.offset.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.role) queryParams.append("role", params.role);

    const url = queryParams.toString()
      ? `/admin/promoters?${queryParams.toString()}`
      : "/admin/promoters";

    const rawResponse = (await apiClient.get(url)) as any;
    const responseData = normalizeResponseData(rawResponse);

    const promoters = Array.isArray(responseData?.data)
      ? responseData.data
      : Array.isArray(responseData)
        ? responseData
        : [];

    const requestedLimit = toPositiveInt(params.limit, 10);
    const requestedOffset = toNonNegativeInt(params.offset, 0);
    const rawPaginationMeta = responseData?.paginationMeta ?? {};
    const total = toNonNegativeInt(rawPaginationMeta.total, promoters.length);
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
    const safeCurrentPage = Math.min(currentPage, totalPages);

    return {
      message:
        responseData?.message ??
        rawResponse?.message ??
        "Promoters fetched successfully",
      data: promoters,
      paginationMeta: {
        total,
        limit,
        offset,
        current_page: safeCurrentPage,
        total_pages: totalPages,
        has_next_page:
          typeof rawPaginationMeta.has_next_page === "boolean"
            ? rawPaginationMeta.has_next_page
            : safeCurrentPage < totalPages,
        has_prev_page:
          typeof rawPaginationMeta.has_prev_page === "boolean"
            ? rawPaginationMeta.has_prev_page
            : safeCurrentPage > 1,
      },
    };
  },

  createPromoter: async (payload: PromoterMutationPayload): Promise<void> => {
    await apiClient.post("/admin/promoter", buildCreatePromoterBody(payload));
  },

  updatePromoter: async (
    promoterId: string,
    payload: PromoterMutationPayload,
  ): Promise<void> => {
    await apiClient.patch(
      `/admin/promoter/${promoterId}`,
      buildUpdatePromoterBody(payload),
    );
  },

  getRoles: async (): Promise<RolesResponse> => {
    const response = (await apiClient.get("/admin/roles")) as any;
    const responseData = normalizeResponseData(response);
    const rolesData = responseData?.roles || responseData?.data || [];
    return { roles: rolesData };
  },

  // Get a specific promoter by ID
  getPromoterById: async (promoterId: string): Promise<UserObject | null> => {
    try {
      const response = (await apiClient.get(
        "/admin/promoters?limit=100",
      )) as any;
      const responseData = normalizeResponseData(response);
      const promoters = Array.isArray(responseData?.data)
        ? responseData.data
        : Array.isArray(responseData)
          ? responseData
          : [];
      const promoter = promoters.find(
        (p: any) => (p.id || p._id) === promoterId,
      );
      return promoter ?? null;
    } catch {
      return null;
    }
  },

  getPromoterNetwork: async (
    _promoterId: string,
    params: { limit?: number; offset?: number } = {},
  ): Promise<{ data: any[]; total: number }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append("limit", String(params.limit));
      if (params.offset) queryParams.append("offset", String(params.offset));

      const url = queryParams.toString()
        ? `/promoter/users?${queryParams.toString()}`
        : "/promoter/users";

      const response = (await apiClient.get(url)) as any;
      const responseData = normalizeResponseData(response);

      return {
        data: responseData?.data || [],
        total: responseData?.paginationMeta?.total || 0,
      };
    } catch {
      return { data: [], total: 0 };
    }
  },

  getPromoterUsers: async (
    promoterId: string,
    params: { limit?: number; offset?: number; search?: string; status?: string } = {},
  ): Promise<{ data: any[]; total: number }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append("limit", String(params.limit));
      if (params.offset) queryParams.append("offset", String(params.offset));
      if (params.search) queryParams.append("search", params.search);
      if (params.status) queryParams.append("status", params.status);

      const url = queryParams.toString()
        ? `/admin/promoters/${promoterId}/users?${queryParams.toString()}`
        : `/admin/promoters/${promoterId}/users`;

      const rawResponse = (await apiClient.get(url)) as any;
      const responseData = normalizeResponseData(rawResponse);

      const users = Array.isArray(responseData?.data)
        ? responseData.data
        : Array.isArray(rawResponse?.data)
          ? rawResponse.data
          : Array.isArray(responseData?.users)
            ? responseData.users
            : Array.isArray(rawResponse?.users)
              ? rawResponse.users
              : Array.isArray(responseData)
                ? responseData
                : [];

      const total = Number(
        responseData?.paginationMeta?.total ??
          rawResponse?.paginationMeta?.total ??
          responseData?.total ??
          rawResponse?.total ??
          users.length ??
          0,
      );

      return { data: users, total };
    } catch {
      return { data: [], total: 0 };
    }
  },

  getPromoterUserById: async (
    promoterId: string,
    userId: string,
  ): Promise<any | null> => {
    const limit = 100;
    let offset = 0;
    let total = Number.POSITIVE_INFINITY;

    while (offset < total) {
      const response = await promoterApi.getPromoterUsers(promoterId, {
        limit,
        offset,
      });
      const found = response.data.find(
        (user: any) => String(user.id || user._id) === String(userId),
      );
      if (found) return found;

      total = response.total;
      offset += limit;
      if (response.data.length < limit) break;
    }

    return null;
  },

  getAdminUserById: async (userId: string): Promise<any | null> => {
    try {
      const limit = 100;
      let offset = 0;
      let total = Number.POSITIVE_INFINITY;

      while (offset < total) {
        const queryParams = new URLSearchParams();
        queryParams.append("limit", String(limit));
        queryParams.append("offset", String(offset));
        const url = `/admin/users?${queryParams.toString()}`;

        const rawResponse = (await apiClient.get(url)) as any;
        const responseData = normalizeResponseData(rawResponse);

        const users = Array.isArray(responseData?.data)
          ? responseData.data
          : Array.isArray(rawResponse?.data)
            ? rawResponse.data
            : Array.isArray(responseData)
              ? responseData
              : [];

        const found = users.find(
          (user: any) => String(user.id || user._id) === String(userId),
        );
        if (found) return found;

        total = Number(
          responseData?.paginationMeta?.total ??
            rawResponse?.paginationMeta?.total ??
            users.length ??
            0,
        );
        offset += limit;
        if (users.length < limit) break;
      }

      return null;
    } catch {
      return null;
    }
  },

  getServicePostsByPromoterId: async (
    promoterId: string,
  ): Promise<PromoterServicePostGroup[]> => {
    try {
      const response = (await apiClient.get(
        `/admin/promoters/${promoterId}/service-posts`,
      )) as any;
      const responseData = normalizeResponseData(response);
      const groups = Array.isArray(responseData?.data)
        ? responseData.data
        : Array.isArray(responseData)
          ? responseData
          : [];
      return groups as PromoterServicePostGroup[];
    } catch {
      return [];
    }
  },

  getAdminUserVehicles: async (
    userId: string,
    params: { limit?: number; offset?: number } = {},
  ): Promise<{ data: any[]; paginationMeta: any }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit !== undefined) {
        queryParams.append("limit", String(params.limit));
      }
      if (params.offset !== undefined) {
        queryParams.append("offset", String(params.offset));
      }
      const url = queryParams.toString()
        ? `/admin/users/${userId}/vehicles?${queryParams.toString()}`
        : `/admin/users/${userId}/vehicles`;

      const rawResponse = (await apiClient.get(url)) as any;
      const responseData = normalizeResponseData(rawResponse);
      const data = Array.isArray(responseData?.data)
        ? responseData.data.map(normalizeTrip)
        : Array.isArray(rawResponse?.data)
          ? rawResponse.data.map(normalizeTrip)
          : Array.isArray(responseData)
            ? responseData.map(normalizeTrip)
            : [];

      const requestedLimit = toPositiveInt(params.limit, 10);
      const requestedOffset = toNonNegativeInt(params.offset, 0);
      const rawPaginationMeta =
        rawResponse?.paginationMeta ?? responseData?.paginationMeta ?? {};
      const total = toNonNegativeInt(rawPaginationMeta.total, data.length);
      const limit = toPositiveInt(rawPaginationMeta.limit, requestedLimit);
      const offset = toNonNegativeInt(
        rawPaginationMeta.offset,
        requestedOffset,
      );
      const totalPages = toPositiveInt(
        rawPaginationMeta.total_pages,
        Math.max(1, Math.ceil(total / limit)),
      );
      const currentPage = toPositiveInt(
        rawPaginationMeta.current_page,
        Math.floor(offset / limit) + 1,
      );

      return {
        data,
        paginationMeta: {
          total,
          limit,
          offset,
          current_page: currentPage,
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
    } catch {
      return {
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
  },

  getAdminUserTrips: async (
    userId: string,
    params: { limit?: number; offset?: number } = {},
  ): Promise<{ data: any[]; paginationMeta: any }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit !== undefined) {
        queryParams.append("limit", String(params.limit));
      }
      if (params.offset !== undefined) {
        queryParams.append("offset", String(params.offset));
      }
      queryParams.append("userId", userId);

      const url = `/admin/users/service-posts?${queryParams.toString()}`;

      const rawResponse = (await apiClient.get(url)) as any;
      const responseData = normalizeResponseData(rawResponse);
      const data = Array.isArray(responseData?.data)
        ? responseData.data
        : Array.isArray(rawResponse?.data)
          ? rawResponse.data
          : Array.isArray(responseData)
            ? responseData
            : [];

      const requestedLimit = toPositiveInt(params.limit, 10);
      const requestedOffset = toNonNegativeInt(params.offset, 0);
      const rawPaginationMeta =
        rawResponse?.paginationMeta ?? responseData?.paginationMeta ?? {};
      const total = toNonNegativeInt(rawPaginationMeta.total, data.length);
      const limit = toPositiveInt(rawPaginationMeta.limit, requestedLimit);
      const offset = toNonNegativeInt(
        rawPaginationMeta.offset,
        requestedOffset,
      );
      const totalPages = toPositiveInt(
        rawPaginationMeta.total_pages,
        Math.max(1, Math.ceil(total / limit)),
      );
      const currentPage = toPositiveInt(
        rawPaginationMeta.current_page,
        Math.floor(offset / limit) + 1,
      );

      return {
        data,
        paginationMeta: {
          total,
          limit,
          offset,
          current_page: currentPage,
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
    } catch {
      return {
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
  },

  // Delete a promoter by ID (soft delete / deactivate)
  deletePromoter: async (
    promoterId: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/admin/users/${promoterId}`);
    return response.data as { success: boolean; message: string };
  },

  // Restore a soft-deleted promoter (activate)
  restorePromoter: async (
    promoterId: string,
  ): Promise<{ success: boolean; message: string; data?: any }> => {
    const response = await apiClient.patch(
      `/admin/users/${promoterId}/restore`,
    );
    return response.data as { success: boolean; message: string; data?: any };
  },
};
