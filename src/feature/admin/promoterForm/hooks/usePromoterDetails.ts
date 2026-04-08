import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { promoterApi } from "../services/promoterApi";
import type { PromoterNetworkMember } from "../components/PromoterNetworkTable";

export interface PromoterProfile {
  id: string;
  fullName: string;
  mobileNumber: string;
  assignedAddress: string;
  isActive: boolean;
  totalOnboard: number;
  totalEarnings: number;
  targetCurrent: number;
  targetTotal: number;
  networkMembers: PromoterNetworkMember[];
}

export function usePromoterDetails(promoterId: string | undefined) {
  const queryClient = useQueryClient();

  // Fetch promoter data
  const {
    data: promoterData,
    isLoading: isLoadingPromoter,
    error: promoterError,
  } = useQuery({
    queryKey: ["promoterDetails", promoterId],
    queryFn: async () => {
      if (!promoterId) return null;
      return promoterApi.getPromoterById(promoterId);
    },
    enabled: !!promoterId,
  });

  // Delete/Deactivate promoter mutation
  const deletePromoterMutation = useMutation({
    mutationFn: async (id: string) => {
      return promoterApi.deletePromoter(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["promoterDetails", promoterId],
      });
      queryClient.invalidateQueries({ queryKey: ["promoters"] });
    },
  });

  // Restore/Activate promoter mutation
  const restorePromoterMutation = useMutation({
    mutationFn: async (id: string) => {
      return promoterApi.restorePromoter(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["promoterDetails", promoterId],
      });
      queryClient.invalidateQueries({ queryKey: ["promoters"] });
    },
  });

  // Fetch promoter users using admin endpoint
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useQuery({
    queryKey: ["promoterUsers", promoterId],
    queryFn: async () => {
      if (!promoterId) return { data: [], total: 0 };
      return promoterApi.getPromoterUsers(promoterId, { limit: 100 });
    },
    enabled: !!promoterId,
  });

  // Transform API data to component format
  const promoter: PromoterProfile | null = promoterData
    ? {
        id: promoterData.id || promoterId || "1",
        fullName: promoterData.fullName || promoterData.name || "Promoter",
        mobileNumber:
          promoterData.mobileNumber || promoterData.phoneNumber || "9876543210",
        assignedAddress:
          promoterData.assignedAddress || promoterData.address || "Pune",
        isActive:
          promoterData.isActive !== false && promoterData.isDeleted !== true,
        totalOnboard: usersData?.total || 0,
        totalEarnings:
          usersData?.data?.reduce(
            (sum: number, user: any) =>
              sum + (user.profileStatus === "verified" ? 10 : 0),
            0,
          ) || 0,
        targetCurrent:
          usersData?.data?.reduce(
            (sum: number, user: any) =>
              sum + (user.profileStatus === "verified" ? 10 : 0),
            0,
          ) || 0,
        targetTotal: (usersData?.total || 0) * 20 || 2000,
        networkMembers:
          usersData?.data?.map((user: any) => ({
            id: user.id || String(Math.random()),
            name: user.name || "Unknown",
            phone: user.phoneNumber || "N/A",
            status:
              user.profileStatus === "verified" ||
              user.profileStatus === "phone_number_verified" ||
              user.profileStatus === "dl_verified" ||
              user.profileStatus === "profile_completed"
                ? "completed"
                : user.profileStatus === "pending"
                  ? "pending"
                  : "inProgress",
          })) || [],
      }
    : null;

  return {
    promoter,
    isLoadingPromoter,
    isLoadingUsers,
    promoterError,
    usersError,
    deletePromoterMutation,
    restorePromoterMutation,
  };
}
