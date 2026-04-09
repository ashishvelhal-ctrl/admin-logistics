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
    params: { limit?: number; offset?: number } = {},
  ): Promise<{ data: any[]; total: number }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append("limit", String(params.limit));
      if (params.offset) queryParams.append("offset", String(params.offset));

      const url = queryParams.toString()
        ? `/admin/promoters/${promoterId}/users?${queryParams.toString()}`
        : `/admin/promoters/${promoterId}/users`;

      const response = (await apiClient.get(url)) as any;
      const responseData = normalizeResponseData(response);

      const users = Array.isArray(responseData.data)
        ? responseData.data
        : Array.isArray(responseData.users)
          ? responseData.users
          : [];

      const total =
        responseData.paginationMeta?.total ||
        responseData.total ||
        users.length ||
        0;

      return { data: users, total };
    } catch {
      return { data: [], total: 0 };
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
