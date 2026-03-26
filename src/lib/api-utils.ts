import { logApiError } from "@/hooks/useApiError";

// Shared response types for API consistency
export interface ApiResponse<T = any> {
  message: string;
  data: T;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  total?: number;
  pagination_meta?: {
    total: number;
    limit: number;
    offset: number;
    current_page: number;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

// Common error handling utility
export const handleApiCall = async <T>(
  apiCall: () => Promise<T>,
  context: string,
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    logApiError(error, context);
    throw error;
  }
};

// Common query options for React Query
export const defaultQueryOptions = {
  retry: false,
  refetchOnWindowFocus: false,
} as const;
