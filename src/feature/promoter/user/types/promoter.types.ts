export interface PromoterUser {
  id: string;
  name: string;
  phoneNumber: string;
  address?: string;
  promoter?: string;
  roles: string[];
  profileStatus:
    | "pending"
    | "verified"
    | "rejected"
    | "dl_verified"
    | "active"
    | "deactivated";
  provideLogistics?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromoterUsersListResponse {
  message: string;
  data: PromoterUser[];
  paginationMeta: {
    limit: number;
    offset: number;
    total: number;
    current_page: number;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

export interface CreatePromoterUserRequest {
  name: string;
  phoneNumber: string;
  address: string;
  provideLogistics: boolean;
  hashCode: string;
}

export interface UpdatePromoterUserRequest {
  name?: string;
  address?: string;
}

export interface ApiResponse<T = unknown> {
  message: string;
  data: T;
}

export interface VerifyPromoterUserOtpRequest {
  phoneNumber: string;
  otpCode: string;
}

export interface VerifyDrivingLicenseRequest {
  userId: string;
  dlNumber: string;
  dateOfBirth: string;
}

export interface VehicleCreateRequest {
  userId: string;
  rcNumber: string;
  loadCapacity: string;
  specialCapabilities: string[];
  thumbnailImage?: File;
  additionalImages?: File[];
}

export interface VehicleObject {
  id: string;
  rcNumber?: string;
  loadCapacity?: string;
  specialCapabilities?: string[];
  createdAt?: string;
  [key: string]: unknown;
}

export interface PaginatedApiResponse<T> extends ApiResponse<{
  data: T[];
  paginationMeta: {
    limit: number;
    offset: number;
    total: number;
    current_page: number;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}> {}
