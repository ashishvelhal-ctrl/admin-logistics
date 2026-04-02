import type {
  CreatePromoterUserRequest,
  UpdatePromoterUserRequest,
  PromoterUser,
  PromoterUsersListResponse,
} from "../types/promoter.types";
import type { GetPromoterUsersQuery } from "../schema/promoter.schema";
import { authAtom } from "@/atoms/authAtom";
import { getDefaultStore } from "jotai";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

class PromoterService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/promoter`;
  }

  private getAuthHeaders(): Record<string, string> {
    const store = getDefaultStore();
    const auth = store.get(authAtom);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (auth.token) {
      headers["Authorization"] = `Bearer ${auth.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || data.message || "API request failed",
      );
    }

    return data;
  }

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

    const response = await fetch(
      `${this.baseUrl}/users?${queryParams.toString()}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      },
    );

    return this.handleResponse<PromoterUsersListResponse>(response);
  }

  // Create a new user under promoter
  async createPromoterUser(
    userData: CreatePromoterUserRequest,
  ): Promise<PromoterUser> {
    const response = await fetch(`${this.baseUrl}/user`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    return this.handleResponse<PromoterUser>(response);
  }

  // Update an existing user
  async updatePromoterUser(
    userId: string,
    updateData: UpdatePromoterUserRequest,
  ): Promise<PromoterUser> {
    const response = await fetch(`${this.baseUrl}/user/${userId}`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData),
    });

    return this.handleResponse<PromoterUser>(response);
  }

  // Get a single user by ID
  async getPromoterUserById(userId: string): Promise<PromoterUser> {
    const response = await fetch(`${this.baseUrl}/user/${userId}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<PromoterUser>(response);
  }

  // Note: Delete user is not implemented in backend yet
  // async deletePromoterUser(userId: string): Promise<void> {
  //   const response = await fetch(`${this.baseUrl}/user/${userId}`, {
  //     method: "DELETE",
  //     headers: {
  //       "Content-Type": "application/json",
  //       // "Authorization": `Bearer ${token}`,
  //     },
  //   });

  //   if (!response.ok) {
  //     const data = await response.json();
  //     throw new Error(data.error?.message || data.message || "Failed to delete user");
  //   }
  // }
}

// Create singleton instance
export const promoterService = new PromoterService();
