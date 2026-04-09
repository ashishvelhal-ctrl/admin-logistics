import { apiClient } from "@/lib/api";

export interface UserObject {
  id: string;
  name: string;
  fullName?: string;
  phoneNumber: string;
  mobileNumber?: string;
  roles: string[];
  address?: string;
  assignedAddress?: string;
  provideLogistics?: boolean;
  profileStatus?: string;
  is_verified?: boolean;
  onboardingCount?: number;
  drivingLicense?: string;
  drivingLicenseData?: any;
  deviceTokens?: string[];
  createdAt: string;
  created_at?: string;
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

export interface UserListResponse {
  message: string;
  data: UserObject[];
  paginationMeta: PaginationMeta;
}

export interface UserListParams {
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

export const userApi = {
  // Fetch user list with pagination and search
  getUsers: async (params: UserListParams = {}): Promise<UserListResponse> => {
    const queryParams = new URLSearchParams();

    if (params.limit !== undefined)
      queryParams.append("limit", params.limit.toString());
    if (params.offset !== undefined)
      queryParams.append("offset", params.offset.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.role) queryParams.append("role", params.role);

    const url = queryParams.toString()
      ? `/admin/users?${queryParams.toString()}`
      : "/admin/users";

    const responseData = (await apiClient.get(url)) as any;

    const users = Array.isArray(responseData?.data)
      ? responseData.data
      : Array.isArray(responseData)
        ? responseData
        : [];

    const requestedLimit = toPositiveInt(params.limit, 10);
    const requestedOffset = toNonNegativeInt(params.offset, 0);
    const rawPaginationMeta = responseData?.paginationMeta ?? {};
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
    const safeCurrentPage = Math.min(currentPage, totalPages);

    return {
      message: responseData?.message ?? "Users fetched successfully",
      data: users,
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

  // Get available roles
  getRoles: async (): Promise<RolesResponse> => {
    const responseData = (await apiClient.get("/admin/roles")) as any;
    const rolesData = responseData?.roles || responseData?.data || [];
    return { roles: rolesData };
  },

  // Delete a user by ID (if needed)
  deleteUser: async (
    userId: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data as { success: boolean; message: string };
  },
};
