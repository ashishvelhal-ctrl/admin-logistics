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

const toPositiveInt = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

const toNonNegativeInt = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : fallback;
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
};

