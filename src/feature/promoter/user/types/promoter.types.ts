export interface PromoterUser {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  promoter: string;
  roles: string[];
  profileStatus: "pending" | "verified" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface PromoterUsersListResponse {
  users: PromoterUser[];
  paginationMeta: {
    limit: number;
    offset: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreatePromoterUserRequest {
  name: string;
  phoneNumber: string;
  address: string;
  promoter?: string;
}

export interface UpdatePromoterUserRequest {
  name?: string;
  address?: string;
  mobileNumber?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedApiResponse<T> extends ApiResponse<{
  items: T[];
  paginationMeta: {
    limit: number;
    offset: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}> {}
