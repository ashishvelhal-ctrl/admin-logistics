import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner"; // Uncomment if you have sonner installed

import { promoterService } from "../service/promoter.service";
import type {
  CreatePromoterUserRequest,
  UpdatePromoterUserRequest,
  VerifyPromoterUserOtpRequest,
} from "../types/promoter.types";
import type { GetPromoterUsersQuery } from "../schema/promoter.schema";

// Query key factory
export const promoterQueryKeys = {
  all: ["promoter"] as const,
  users: () => [...promoterQueryKeys.all, "users"] as const,
  usersList: (query: GetPromoterUsersQuery) =>
    [...promoterQueryKeys.users(), "list", query] as const,
  user: (id: string) => [...promoterQueryKeys.users(), id] as const,
};

// Hook for fetching promoter users with pagination and search
export const usePromoterUsers = (
  query: GetPromoterUsersQuery = { limit: 10, offset: 0 },
) => {
  return useQuery({
    queryKey: promoterQueryKeys.usersList(query),
    queryFn: () => promoterService.getPromoterUsers(query),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook for creating a new promoter user
export const useCreatePromoterUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreatePromoterUserRequest) =>
      promoterService.createPromoterUser(userData),
    onSuccess: () => {
      // OTP sent successfully
      // Invalidate users list to refresh data
      queryClient.invalidateQueries({ queryKey: promoterQueryKeys.users() });
    },
    onError: () => {
      // toast.error(error.message || "Failed to create user");
    },
  });
};

// Hook for updating a promoter user
export const useUpdatePromoterUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      updateData,
    }: {
      userId: string;
      updateData: UpdatePromoterUserRequest;
    }) => promoterService.updatePromoterUser(userId, updateData),
    onSuccess: (response) => {
      const data = response.data;
      if (!data) return;
      // Update the specific user in cache
      queryClient.setQueryData(promoterQueryKeys.user(data.id), data);
      // Invalidate users list to refresh data
      queryClient.invalidateQueries({ queryKey: promoterQueryKeys.users() });
    },
    onError: () => {
      // toast.error(error.message || "Failed to update user");
    },
  });
};

// Hook for verifying OTP for promoter-created user
export const useVerifyPromoterUserOtp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VerifyPromoterUserOtpRequest) =>
      promoterService.verifyPromoterUserOtp(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promoterQueryKeys.users() });
    },
  });
};

// Hook for fetching a single promoter user
export const usePromoterUser = (userId: string) => {
  return useQuery({
    queryKey: promoterQueryKeys.user(userId),
    queryFn: async () => {
      const response = await promoterService.getPromoterUsers({
        limit: 100,
        offset: 0,
      });
      const user = response.data.find((item) => item.id === userId);
      if (!user) throw new Error("User not found");
      return user;
    },
    enabled: !!userId, // Only run query if userId is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
