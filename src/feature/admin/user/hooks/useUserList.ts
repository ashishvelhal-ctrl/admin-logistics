import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../services/userApi";
import type { UserObject, PaginationMeta } from "../services/userApi";
import { useDebounce } from "@/hooks";

interface UseUserListParams {
  initialLimit?: number;
  initialSearch?: string;
}

interface UseUserListReturn {
  users: UserObject[];
  paginationMeta: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  search: string;
  status: "all" | "active" | "inactive" | "pending";
  totalPages: number;
  roleOptions: Array<{
    _id: string;
    title: string;
    description: string;
    hierarchy: number;
    isActive: boolean;
  }>;
  fetchUsers: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  handleSearch: (searchTerm: string) => void;
  handleStatusChange: (
    status: "all" | "active" | "inactive" | "pending",
  ) => void;
  handlePageChange: (page: number) => void;
  handleDeleteUser: (userId: string) => Promise<boolean>;
  resetFilters: () => void;
  refreshList: () => Promise<void>;
}

export const useUserList = ({
  initialLimit = 10,
  initialSearch = "",
}: UseUserListParams = {}): UseUserListReturn => {
  const queryClient = useQueryClient();
  const safeLimit = Math.max(1, initialLimit);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState<"all" | "active" | "inactive" | "pending">(
    "all",
  );

  const searchTerm = useDebounce(search, 300).trim();
  const statusFilter = status;
  const statusForApi =
    statusFilter === "inactive" ? "deactivated" : statusFilter;

  const {
    data: usersResponse,
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users", safeLimit, currentPage, searchTerm, statusFilter],
    queryFn: async () => {
      const offset = (currentPage - 1) * safeLimit;
      return userApi.getUsers({
        limit: safeLimit,
        offset,
        search: searchTerm,
        status: statusForApi,
      });
    },
  });

  const {
    data: rolesResponse,
    error: rolesError,
    refetch: refetchRoles,
  } = useQuery({
    queryKey: ["user-roles"],
    queryFn: () => userApi.getRoles(),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => userApi.deleteUser(userId),
    onSuccess: async (_, deletedUserId) => {
      queryClient.setQueriesData({ queryKey: ["users"] }, (oldData: any) => {
        if (!oldData || !Array.isArray(oldData.data)) return oldData;

        const nextData = oldData.data.filter(
          (item: any) => (item.id || item._id) !== deletedUserId,
        );

        const currentTotal =
          typeof oldData?.paginationMeta?.total === "number"
            ? oldData.paginationMeta.total
            : oldData.data.length;

        return {
          ...oldData,
          data: nextData,
          paginationMeta: oldData.paginationMeta
            ? {
                ...oldData.paginationMeta,
                total: Math.max(0, currentTotal - 1),
              }
            : oldData.paginationMeta,
        };
      });

      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const users: UserObject[] = useMemo(() => {
    const dataArray = Array.isArray(usersResponse?.data)
      ? usersResponse.data
      : [];

    return dataArray.map((user: any) => ({
      ...user,
      fullName: user.name,
      mobileNumber: user.phoneNumber,
      assignedAddress: user.address,
      is_verified: user.profileStatus === "dl_verified",
      onboardingCount: 0,
      created_at: user.createdAt,
    }));
  }, [usersResponse]);

  const paginationMeta: PaginationMeta | null = useMemo(() => {
    if (!usersResponse) return null;

    return {
      ...usersResponse.paginationMeta,
      limit: usersResponse.paginationMeta.limit || safeLimit,
      offset:
        usersResponse.paginationMeta.offset ?? (currentPage - 1) * safeLimit,
      current_page: usersResponse.paginationMeta.current_page || currentPage,
      total_pages: usersResponse.paginationMeta.total_pages || 1,
    };
  }, [usersResponse, currentPage, safeLimit]);

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

  const handleStatusChange = useCallback(
    (newStatus: "all" | "active" | "inactive" | "pending") => {
      setStatus(newStatus);
      setCurrentPage(1);
    },
    [],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1) return;
      if (paginationMeta && page > paginationMeta.total_pages) return;
      setCurrentPage(page);
    },
    [paginationMeta],
  );

  const handleDeleteUser = useCallback(
    async (userId: string): Promise<boolean> => {
      try {
        await deleteUserMutation.mutateAsync(userId);
        return true;
      } catch (err) {
        console.error("Failed to delete user:", err);
        return false;
      }
    },
    [deleteUserMutation],
  );

  const resetFilters = useCallback(() => {
    setSearch("");
    setStatus("all");
    setCurrentPage(1);
  }, []);

  const refreshList = useCallback(async () => {
    await refetchUsers();
  }, [refetchUsers]);

  const fetchUsers = useCallback(async () => {
    await refetchUsers();
  }, [refetchUsers]);

  const fetchRoles = useCallback(async () => {
    await refetchRoles();
  }, [refetchRoles]);

  const totalPages = paginationMeta?.total_pages || 1;
  const isLoading =
    isLoadingUsers || isFetchingUsers || deleteUserMutation.isPending;
  const error =
    (usersError instanceof Error && usersError.message) ||
    (rolesError instanceof Error && rolesError.message) ||
    (deleteUserMutation.error instanceof Error &&
      deleteUserMutation.error.message) ||
    null;

  return {
    users,
    paginationMeta,
    isLoading,
    error,
    currentPage,
    search,
    status,
    totalPages,
    roleOptions,
    fetchUsers,
    fetchRoles,
    handleSearch,
    handleStatusChange,
    handlePageChange,
    handleDeleteUser,
    resetFilters,
    refreshList,
  };
};
