import { apiClient } from "@/lib/api";

// Define types based on backend structure
export interface UserObject {
  id: string;
  name: string;
  fullName?: string; // For backward compatibility - map from name
  phoneNumber: string;
  mobileNumber?: string; // For backward compatibility - map from phoneNumber
  roles: string[];
  address?: string;
  assignedAddress?: string; // For backward compatibility - map from address
  provideLogistics?: boolean;
  profileStatus?: string;
  is_verified?: boolean; // For backward compatibility - map from profileStatus
  onboardingCount?: number; // For backward compatibility
  drivingLicense?: string;
  drivingLicenseData?: any;
  deviceTokens?: string[];
  createdAt: string;
  created_at?: string; // For backward compatibility - map from createdAt
  updatedAt: string;
  [key: string]: any;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  current_page: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

export interface PromoterListResponse {
  message: string;
  data: UserObject[];
  paginationMeta: PaginationMeta;
}

export interface PromoterListParams {
  limit?: number;
  offset?: number;
  search?: string;
  role?: string;
}

export interface RolesResponse {
  roles?: Array<{
    _id: string;
    title: string;
    description: string;
    hierarchy: number;
    isActive: boolean;
  }>;
  data?: Array<{
    _id: string;
    title: string;
    description: string;
    hierarchy: number;
    isActive: boolean;
  }>;
}

export interface PromoterMutationPayload {
  name: string;
  phoneNumber: string;
  address?: string;
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

const buildPromoterBodyWithPhoneNumber = (
  payload: PromoterMutationPayload,
): Record<string, unknown> => ({
  name: payload.name,
  address: payload.address,
  phoneNumber: payload.phoneNumber,
});

const buildPromoterBodyForUpdate = (
  payload: PromoterMutationPayload,
): Record<string, unknown> => ({
  name: payload.name,
  address: payload.address,
  // Note: phoneNumber is not allowed in update according to backend schema
});

const shouldRetryWithMobileNumber = (error: unknown): boolean => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("validation failed") ||
      message.includes("unrecognized key") ||
      message.includes("phonenumber")
    );
  }
  return false;
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

    const normalizedResponse =
      rawResponse &&
      typeof rawResponse === "object" &&
      rawResponse.data &&
      !Array.isArray(rawResponse.data) &&
      Array.isArray(rawResponse.data.data)
        ? rawResponse.data
        : rawResponse;

    const promoters = Array.isArray(normalizedResponse?.data)
      ? normalizedResponse.data
      : Array.isArray(rawResponse?.data)
        ? rawResponse.data
        : Array.isArray(rawResponse)
          ? rawResponse
          : [];

    const requestedLimit = toPositiveInt(params.limit, 10);
    const requestedOffset = toNonNegativeInt(params.offset, 0);
    const rawPaginationMeta = normalizedResponse?.paginationMeta ?? {};
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
        normalizedResponse?.message ??
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
    try {
      await apiClient.post(
        "/admin/promoter",
        buildPromoterBodyWithPhoneNumber(payload),
      );
    } catch (firstError) {
      if (!shouldRetryWithMobileNumber(firstError)) {
        throw firstError;
      }

      try {
        await apiClient.post(
          "/admin/promoter",
          buildPromoterBodyForUpdate(payload),
        );
      } catch (secondError) {
        throw secondError;
      }
    }
  },

  updatePromoter: async (
    promoterId: string,
    payload: PromoterMutationPayload,
  ): Promise<void> => {
    // According to backend schema, updates only allow name and address, not phoneNumber
    await apiClient.patch(
      `/admin/promoter/${promoterId}`,
      buildPromoterBodyForUpdate(payload),
    );
  },

  // Get available roles
  getRoles: async (): Promise<RolesResponse> => {
    try {
      const response = (await apiClient.get("/admin/roles")) as any;
      const rolesData = response.data?.roles || response.data?.data || [];
      return { roles: rolesData };
    } catch (err) {
      console.error("Failed to fetch roles:", err);
      // Set fallback options if API fails
      return {
        roles: [
          {
            _id: "",
            title: "All Roles",
            description: "Show all users",
            hierarchy: 0,
            isActive: true,
          },
          {
            _id: "admin",
            title: "Admin",
            description:
              "Administrative work. Highest level of authority can do almost anything.",
            hierarchy: 100,
            isActive: true,
          },
          {
            _id: "promoter",
            title: "Promoter",
            description: "Manage promotional activities.",
            hierarchy: 20,
            isActive: true,
          },
          {
            _id: "user",
            title: "User",
            description: "Default role assigned to every person.",
            hierarchy: 1,
            isActive: true,
          },
        ],
      };
    }
  },

  // Delete a promoter by ID (if needed)
  deletePromoter: async (
    promoterId: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/admin/users/${promoterId}`);
    return response.data as { success: boolean; message: string };
  },
};
