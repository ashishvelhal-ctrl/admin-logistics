import type {
  ApiResponse,
  CreatePromoterUserRequest,
  PromoterUser,
  PromoterUsersListResponse,
  UpdatePromoterUserRequest,
  VerifyDrivingLicenseRequest,
  VerifyPromoterUserOtpRequest,
  VehicleCreateRequest,
  VehicleObject,
} from "../types/promoter.types";
import type { GetPromoterUsersQuery } from "../schema/promoter.schema";
import { apiClient } from "@/lib/api";

class PromoterService {
  // Get all users for a promoter with pagination and search
  async getPromoterUsers(
    query: Partial<GetPromoterUsersQuery> = {},
  ): Promise<PromoterUsersListResponse> {
    const queryParams = new URLSearchParams();

    const defaultQuery = {
      limit: 10,
      offset: 0,
      ...query,
    };

    queryParams.append("limit", defaultQuery.limit.toString());
    queryParams.append("offset", defaultQuery.offset.toString());
    if (defaultQuery.search) queryParams.append("search", defaultQuery.search);
    const responseData = (await apiClient.get(
      `/promoter/users?${queryParams.toString()}`,
    )) as any;
    const users = Array.isArray(responseData?.data) ? responseData.data : [];

    return {
      message: responseData?.message ?? "Users fetched successfully",
      data: users,
      paginationMeta: responseData?.paginationMeta ?? {
        total: users.length,
        limit: defaultQuery.limit,
        offset: defaultQuery.offset,
        current_page: Math.floor(defaultQuery.offset / defaultQuery.limit) + 1,
        total_pages: Math.max(1, Math.ceil(users.length / defaultQuery.limit)),
        has_next_page: false,
        has_prev_page: defaultQuery.offset > 0,
      },
    };
  }

  // Create a promoter-owned user and send OTP
  async createPromoterUser(
    userData: CreatePromoterUserRequest,
  ): Promise<ApiResponse<null>> {
    const response = (await apiClient.post("/promoter/user", userData)) as any;
    return {
      message: response?.message ?? "OTP sent successfully",
      data: response?.data ?? null,
    };
  }

  // Verify promoter-owned user's OTP
  async verifyPromoterUserOtp(
    payload: VerifyPromoterUserOtpRequest,
  ): Promise<ApiResponse<PromoterUser>> {
    const response = (await apiClient.post(
      "/promoter/user/verify-otp",
      payload,
    )) as any;
    return {
      message: response?.message ?? "OTP verified successfully",
      data: response?.data,
    };
  }

  // Update an existing user
  async updatePromoterUser(
    userId: string,
    updateData: UpdatePromoterUserRequest,
  ): Promise<ApiResponse<PromoterUser>> {
    const response = (await apiClient.patch(
      `/promoter/user/${userId}`,
      updateData,
    )) as any;
    return {
      message: response?.message ?? "User updated successfully",
      data: response?.data,
    };
  }

  // Verify driving license of a promoter-owned user
  async verifyDrivingLicense(
    payload: VerifyDrivingLicenseRequest,
  ): Promise<ApiResponse<any>> {
    const response = (await apiClient.post(
      "/promoter/user/verify-driving-license",
      payload,
    )) as any;
    return {
      message: response?.message ?? "Driving license verified successfully",
      data: response?.data,
    };
  }

  // Create vehicle for a promoter-owned user
  async createVehicle(
    payload: VehicleCreateRequest,
  ): Promise<ApiResponse<VehicleObject>> {
    const formData = new FormData();
    formData.append("userId", payload.userId);
    formData.append("rcNumber", payload.rcNumber);
    formData.append("loadCapacity", payload.loadCapacity);
    payload.specialCapabilities.forEach((capability) => {
      formData.append("specialCapabilities", capability);
    });

    if (payload.thumbnailImage) {
      formData.append("thumbnailImage", payload.thumbnailImage);
    }
    payload.additionalImages?.forEach((file) => {
      formData.append("additionalImages", file);
    });

    const response = (await apiClient.post(
      "/promoter/user/vehicles",
      formData,
    )) as any;
    return {
      message: response?.message ?? "Vehicle created successfully",
      data: response?.data,
    };
  }
}

// Create singleton instance
export const promoterService = new PromoterService();
