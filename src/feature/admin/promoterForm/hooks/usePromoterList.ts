import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { promoterApi } from "../services/promoterApi";
import type { PaginationMeta, UserObject } from "../schema/promoterSchema";

interface UsePromoterListParams {
  initialLimit?: number;
  initialSearch?: string;
}

interface UsePromoterListReturn {
  promoters: UserObject[];
  paginationMeta: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  search: string;
  role: string;
  totalPages: number;
  roleOptions: Array<{
    _id: string;
    title: string;
    description: string;
    hierarchy: number;
    isActive: boolean;
  }>;
  fetchPromoters: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  handleSearch: (searchTerm: string) => void;
  handleRoleChange: (role: string) => void;
  handlePageChange: (page: number) => void;
  handleDeletePromoter: (promoterId: string) => Promise<boolean>;
  resetFilters: () => void;
  refreshList: () => Promise<void>;
}

export const usePromoterList = ({
  initialLimit = 10,
  initialSearch = "",
}: UsePromoterListParams = {}): UsePromoterListReturn => {
  const queryClient = useQueryClient();
  const safeLimit = Math.max(1, initialLimit);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(initialSearch);
  const [role, setRole] = useState("");

  const searchTerm = search.trim();
  const roleFilter = role.trim();

  const calculateOffset = useCallback((page: number, limit: number) => {
    return (page - 1) * limit;
  }, []);

  const buildFallbackPaginationMeta = useCallback(
    (total: number, offset: number): PaginationMeta => {
      const totalPages = Math.max(1, Math.ceil(total / safeLimit));
      const currentPageFromOffset = Math.floor(offset / safeLimit) + 1;
      const safeCurrentPage = Math.min(
        Math.max(1, currentPageFromOffset),
        totalPages,
      );

      return {
        total,
        limit: safeLimit,
        offset,
        current_page: safeCurrentPage,
        total_pages: totalPages,
        has_next_page: safeCurrentPage < totalPages,
        has_prev_page: safeCurrentPage > 1,
      };
    },
    [safeLimit],
  );

  const {
    data: promotersResponse,
    isLoading: isLoadingPromoters,
    isFetching: isFetchingPromoters,
    error: promotersError,
    refetch: refetchPromoters,
  } = useQuery({
    queryKey: ["promoters", safeLimit, currentPage, searchTerm, roleFilter],
    queryFn: async () => {
      const offset = calculateOffset(currentPage, safeLimit);
      return promoterApi.getPromoters({
        limit: safeLimit,
        offset,
        search: searchTerm,
        role: roleFilter || undefined,
      });
    },
  });

  const {
    data: rolesResponse,
    error: rolesError,
    refetch: refetchRoles,
  } = useQuery({
    queryKey: ["promoter-roles"],
    queryFn: () => promoterApi.getRoles(),
  });

  const deletePromoterMutation = useMutation({
    mutationFn: (promoterId: string) => promoterApi.deletePromoter(promoterId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["promoters"] });
      await queryClient.invalidateQueries({ queryKey: ["promoterDetails"] });
    },
  });

  const promoters: UserObject[] = useMemo(() => {
    const dataArray = Array.isArray(promotersResponse?.data)
      ? promotersResponse.data
      : [];

    try {
      return dataArray.map((promoter: any) => ({
        ...promoter,
        fullName: promoter.name,
        mobileNumber: promoter.phoneNumber,
        assignedAddress: promoter.address,
        is_verified: promoter.profileStatus === "dl_verified",
        onboardingCount: 0,
        created_at: promoter.createdAt,
      }));
    } catch (transformError) {
      console.error("Error during data transformation:", transformError);
      return [];
    }
  }, [promotersResponse]);

  const paginationMeta: PaginationMeta | null = useMemo(() => {
    const offset = calculateOffset(currentPage, safeLimit);
    if (!promotersResponse) return null;

    return promotersResponse.paginationMeta
      ? {
          ...promotersResponse.paginationMeta,
          limit: promotersResponse.paginationMeta.limit || safeLimit,
          offset: promotersResponse.paginationMeta.offset ?? offset,
          current_page:
            promotersResponse.paginationMeta.current_page || currentPage,
          total_pages: promotersResponse.paginationMeta.total_pages || 1,
        }
      : buildFallbackPaginationMeta(promoters.length, offset);
  }, [
    promotersResponse,
    currentPage,
    safeLimit,
    promoters.length,
    calculateOffset,
    buildFallbackPaginationMeta,
  ]);

  const roleOptions = useMemo(() => {
    const baseRoles = Array.isArray(rolesResponse?.roles)
      ? rolesResponse.roles
      : [];
    const allRolesOption = {
      _id: "",
      title: "All Roles",
      description: "Show all users",
      hierarchy: 0,
      isActive: true,
    };

    if (baseRoles.some((item) => item._id === "")) {
      return baseRoles;
    }

    return [allRolesOption, ...baseRoles];
  }, [rolesResponse]);

  const handleSearch = useCallback((searchTermValue: string) => {
    setSearch(searchTermValue);
    setCurrentPage(1);
  }, []);

  const handleRoleChange = useCallback((newRole: string) => {
    setRole(newRole);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1) return;
      if (paginationMeta && page > paginationMeta.total_pages) return;
      setCurrentPage(page);
    },
    [paginationMeta],
  );

  const handleDeletePromoter = useCallback(
    async (promoterId: string): Promise<boolean> => {
      try {
        await deletePromoterMutation.mutateAsync(promoterId);
        return true;
      } catch (err) {
        console.error("Failed to delete promoter:", err);
        return false;
      }
    },
    [deletePromoterMutation],
  );

  const resetFilters = useCallback(() => {
    setSearch("");
    setRole("");
    setCurrentPage(1);
  }, []);

  const refreshList = useCallback(async () => {
    await refetchPromoters();
  }, [refetchPromoters]);

  const fetchPromoters = useCallback(async () => {
    await refetchPromoters();
  }, [refetchPromoters]);

  const fetchRoles = useCallback(async () => {
    await refetchRoles();
  }, [refetchRoles]);

  const totalPages = paginationMeta?.total_pages || 1;
  const isLoading =
    isLoadingPromoters ||
    isFetchingPromoters ||
    deletePromoterMutation.isPending;
  const error =
    (promotersError instanceof Error && promotersError.message) ||
    (rolesError instanceof Error && rolesError.message) ||
    (deletePromoterMutation.error instanceof Error &&
      deletePromoterMutation.error.message) ||
    null;

  return {
    promoters,
    paginationMeta,
    isLoading,
    error,
    currentPage,
    search,
    role,
    totalPages,
    roleOptions,
    fetchPromoters,
    fetchRoles,
    handleSearch,
    handleRoleChange,
    handlePageChange,
    handleDeletePromoter,
    resetFilters,
    refreshList,
  };
};
