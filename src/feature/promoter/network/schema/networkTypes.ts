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

export interface PaginationParams {
  limit?: number;
  offset?: number;
}
