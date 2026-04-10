import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { promoterApi } from "../services/promoterApi";
import type {
  PromoterNetworkMember,
  PromoterTripRow,
} from "../components/PromoterNetworkTable";

export interface PromoterProfile {
  id: string;
  fullName: string;
  mobileNumber: string;
  assignedAddress: string;
  isActive: boolean;
  totalOnboard: number;
  totalCreatedTrips: number;
  totalEarnings: number;
  targetCurrent: number;
  targetTotal: number;
  networkMembers: PromoterNetworkMember[];
  tripRows: PromoterTripRow[];
}

function normalizeTripStatus(status: unknown): PromoterNetworkMember["status"] {
  const value = String(status || "")
    .trim()
    .toLowerCase();

  if (value === "completed" || value === "delivered" || value === "verified") {
    return "completed";
  }

  if (value === "pending" || value === "requested" || value === "new") {
    return "pending";
  }

  return "inProgress";
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
    onSuccess: async (_, id) => {
      queryClient.setQueryData(["promoterDetails", id], (oldData: any) => {
        if (!oldData) return oldData;
        const now = new Date().toISOString();
        return {
          ...oldData,
          isActive: false,
          isDeleted: true,
          deletedAt: oldData.deletedAt ?? now,
          updatedAt: now,
        };
      });

      await queryClient.invalidateQueries({
        queryKey: ["promoterDetails", promoterId],
      });
      await queryClient.invalidateQueries({ queryKey: ["promoters"] });
      await queryClient.refetchQueries({
        queryKey: ["promoterDetails", promoterId],
      });
      await queryClient.refetchQueries({ queryKey: ["promoters"] });
    },
  });

  // Restore/Activate promoter mutation
  const restorePromoterMutation = useMutation({
    mutationFn: async (id: string) => {
      return promoterApi.restorePromoter(id);
    },
    onSuccess: async (_, id) => {
      queryClient.setQueryData(["promoterDetails", id], (oldData: any) => {
        if (!oldData) return oldData;
        const now = new Date().toISOString();
        return {
          ...oldData,
          isActive: true,
          isDeleted: false,
          deletedAt: null,
          updatedAt: now,
        };
      });

      await queryClient.invalidateQueries({
        queryKey: ["promoterDetails", promoterId],
      });
      await queryClient.invalidateQueries({ queryKey: ["promoters"] });
      await queryClient.refetchQueries({
        queryKey: ["promoterDetails", promoterId],
      });
      await queryClient.refetchQueries({ queryKey: ["promoters"] });
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

  const {
    data: servicePostGroups,
    isLoading: isLoadingTrips,
    error: tripsError,
  } = useQuery({
    queryKey: ["promoterServicePosts", promoterId],
    queryFn: async () => {
      if (!promoterId) return [];
      return promoterApi.getServicePostsByPromoterId(promoterId);
    },
    enabled: !!promoterId,
  });

  // Transform API data to component format
  const tripRows: PromoterTripRow[] =
    servicePostGroups?.flatMap((group: any, groupIndex: number) => {
      const createdBy = group?.user?.name || "Unknown";
      const servicePosts = Array.isArray(group?.servicePosts)
        ? group.servicePosts
        : [];

      return servicePosts.map((post: any, postIndex: number) => ({
        id: String(post?.id || post?._id || `${groupIndex}-${postIndex}`),
        name: post?.postId
          ? `Trip #${post.postId}`
          : `Trip #${groupIndex + 1}-${postIndex + 1}`,
        secondary: createdBy,
        status: normalizeTripStatus(post?.status),
      }));
    }) || [];

  const promoter: PromoterProfile | null = promoterData
    ? {
        isActive:
          promoterData.isActive !== false &&
          promoterData.isDeleted !== true &&
          !Boolean((promoterData as { deletedAt?: string | null }).deletedAt),
        id: promoterData.id || promoterId || "1",
        fullName: promoterData.fullName || promoterData.name || "Promoter",
        mobileNumber:
          promoterData.mobileNumber || promoterData.phoneNumber || "9876543210",
        assignedAddress:
          promoterData.assignedAddress || promoterData.address || "Pune",
        totalOnboard: usersData?.total || 0,
        totalCreatedTrips: tripRows.length,
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
        tripRows,
      }
    : null;

  return {
    promoter,
    isLoadingPromoter,
    isLoadingUsers,
    isLoadingTrips,
    promoterError,
    usersError,
    tripsError,
    deletePromoterMutation,
    restorePromoterMutation,
  };
}
