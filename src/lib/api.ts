const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export { API_BASE_URL };

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}

let isRefreshing = false;
let queue: any[] = [];

// Helper to get token from sessionStorage
const getTokenSync = () => {
  const tokens = sessionStorage.getItem("auth_tokens");
  return tokens ? JSON.parse(tokens) : null;
};

// Helper to set token in sessionStorage
const setTokenSync = (tokens: any) => {
  sessionStorage.setItem("auth_tokens", JSON.stringify(tokens));
};

// Helper to handle logout (redirect to login)
const logout = () => {
  sessionStorage.removeItem("auth_tokens");
  window.location.href = "/auth/login";
};

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): Record<string, string> {
    // Get token from sessionStorage
    const tokenStorage = sessionStorage.getItem("auth_tokens");

    if (tokenStorage) {
      try {
        const parsed = JSON.parse(tokenStorage);
        if (parsed && parsed.access) {
          const authHeader = `Bearer ${parsed.access}`;
          return {
            Authorization: authHeader,
          };
        }
      } catch (error) {
        console.error("Failed to parse token:", error);
      }
    }

    return {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const isFormData =
      typeof FormData !== "undefined" && options.body instanceof FormData;

    const headers = new Headers(options.headers);

    // Add auth headers (don't override if caller already set them)
    for (const [k, v] of Object.entries(this.getAuthHeaders())) {
      if (!headers.has(k)) headers.set(k, v);
    }

    if (isFormData) {
      // Ensure we don't force an incorrect content-type for multipart
      headers.delete("Content-Type");
      headers.delete("content-type");
    } else if (!headers.has("Content-Type") && !headers.has("content-type")) {
      headers.set("Content-Type", "application/json");
    }

    const config: RequestInit = {
      headers,
      credentials: "include",
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401 || response.status === 498) {
          if (!(config as any)._retry) {
            (config as any)._retry = true;

            const tokens = getTokenSync();
            const refreshToken = tokens?.refresh;

            if (!refreshToken) {
              logout();
              throw new Error("No refresh token");
            }

            if (isRefreshing) {
              return new Promise((resolve, reject) => {
                queue.push({ resolve, reject });
              }).then(() => this.request<T>(endpoint, options));
            }

            isRefreshing = true;

            try {
              const refreshRes = await fetch(
                `${this.baseUrl}/auth/refresh-token`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ refreshToken }),
                },
              );

              if (!refreshRes.ok) {
                logout();
                throw new Error("Refresh failed");
              }

              const refreshData = await refreshRes.json();
              const newAccess = refreshData.data.accessToken;

              setTokenSync({ access: newAccess, refresh: refreshToken });

              queue.forEach((p) => p.resolve());
              queue = [];

              // Retry original request
              return this.request<T>(endpoint, options);
            } catch (refreshError) {
              queue.forEach((p) => p.reject(refreshError));
              queue = [];
              logout();
              throw refreshError;
            } finally {
              isRefreshing = false;
            }
          }
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;

    const body = data ? (isFormData ? data : JSON.stringify(data)) : undefined;

    return this.request<T>(endpoint, {
      method: "POST",
      body,
    });
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "GET",
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
    });
  }

  async delete<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;

    return this.request<T>(endpoint, {
      method: "DELETE",
      body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
    });
  }
}

export const apiClient = new ApiClient();

// Auth specific API calls
export const authApi = {
  sendOtp: (phoneNumber: string, hashCode: string) =>
    apiClient.post("/auth/send-otp", { phoneNumber, hashCode }),

  verifyOtp: (phoneNumber: string, otpCode: string) =>
    apiClient.post("/auth/verify-otp", { phoneNumber, otpCode }),

  refreshToken: (refreshToken: string) =>
    apiClient.post("/auth/refresh-token", { refreshToken }),

  logout: () => apiClient.post("/auth/logout"),

  logoutAll: () => apiClient.post("/auth/logout-all"),

  getMe: () => apiClient.get("/auth/me"),
};

// Utility function for authenticated fetch to eliminate duplication
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  const token = sessionStorage.getItem("auth_tokens");
  let authHeader: Record<string, string> = {};
  try {
    const parsed = JSON.parse(token ?? "");
    if (parsed?.access) {
      authHeader = { Authorization: `Bearer ${parsed.access}` };
    }
  } catch {}

  const headers = new Headers(options.headers);
  for (const [k, v] of Object.entries(authHeader)) {
    if (!headers.has(k)) headers.set(k, v);
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  return fetch(url, config);
};
