import { useState, useEffect, useCallback } from 'react';
import { userApi } from '../services/userApi';
import type { UserObject, PaginationMeta } from '../services/userApi';

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
  role: string;
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
  handleRoleChange: (role: string) => void;
  handlePageChange: (page: number) => void;
  handleDeleteUser: (userId: string) => Promise<boolean>;
  resetFilters: () => void;
  refreshList: () => Promise<void>;
}

export const useUserList = ({
  initialLimit = 10,
  initialSearch = '',
}: UseUserListParams = {}): UseUserListReturn => {
  const safeLimit = Math.max(1, initialLimit);
  const [users, setUsers] = useState<UserObject[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(initialSearch);
  const [role, setRole] = useState('');
  const [roleOptions, setRoleOptions] = useState<Array<{
    _id: string;
    title: string;
    description: string;
    hierarchy: number;
    isActive: boolean;
  }>>([]);

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

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const offset = calculateOffset(currentPage, safeLimit);
      const response = await userApi.getUsers({
        limit: safeLimit,
        offset,
        search: search.trim(),
        role: role.trim() || undefined,
      });

      const dataArray = Array.isArray(response.data) ? response.data : [];

      // Transform API data to match column expectations
      let transformedData: any[] = [];
      try {
        transformedData = dataArray.map((user: any) => {
          return {
            ...user,
            // Add backward compatibility fields
            fullName: user.name,
            mobileNumber: user.phoneNumber,
            assignedAddress: user.address,
            is_verified: user.profileStatus === 'dl_verified',
            onboardingCount: 0, // Default value since API doesn't provide this
            created_at: user.createdAt,
          };
        });
      } catch (transformError) {
        console.error('Error during data transformation:', transformError);
        setError('Data transformation failed');
        setUsers([]);
        return;
      }

      const usersData = Array.isArray(transformedData) ? transformedData : [];
      setUsers(usersData);

      const normalizedPaginationMeta = response.paginationMeta
        ? {
            ...response.paginationMeta,
            limit: response.paginationMeta.limit || safeLimit,
            offset: response.paginationMeta.offset ?? offset,
            current_page: response.paginationMeta.current_page || currentPage,
            total_pages: response.paginationMeta.total_pages || 1,
          }
        : buildFallbackPaginationMeta(usersData.length, offset);

      setPaginationMeta(normalizedPaginationMeta);

      if (normalizedPaginationMeta.current_page !== currentPage) {
        setCurrentPage(normalizedPaginationMeta.current_page);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      setUsers([]); // Ensure it's always an array
      setPaginationMeta(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, safeLimit, search, role, calculateOffset, buildFallbackPaginationMeta]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await userApi.getRoles();
      const rolesData = response.roles || [];
      // Add "All Roles" option at the beginning
      setRoleOptions([
        { _id: '', title: 'All Roles', description: 'Show all users', hierarchy: 0, isActive: true },
        ...rolesData
      ]);
    } catch (err) {
      console.error('Failed to fetch roles:', err);
      // Set fallback options if API fails
      setRoleOptions([
        { _id: '', title: 'All Roles', description: 'Show all users', hierarchy: 0, isActive: true },
        { _id: 'admin', title: 'Admin', description: 'Administrative work. Highest level of authority can do almost anything.', hierarchy: 100, isActive: true },
        { _id: 'promoter', title: 'Promoter', description: 'Manage promotional activities.', hierarchy: 20, isActive: true },
        { _id: 'user', title: 'User', description: 'Default role assigned to every person.', hierarchy: 1, isActive: true },
      ]);
    }
  }, []);

  const handleSearch = useCallback((searchTerm: string) => {
    setSearch(searchTerm);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handleRoleChange = useCallback((newRole: string) => {
    setRole(newRole);
    setCurrentPage(1); // Reset to first page when changing role
  }, []);

  const handlePageChange = useCallback((page: number) => {
    if (page < 1) return;
    if (paginationMeta && page > paginationMeta.total_pages) return;
    setCurrentPage(page);
  }, [paginationMeta]);

  const handleDeleteUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await userApi.deleteUser(userId);
      
      // Refresh the list after successful deletion
      await fetchUsers();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchUsers]);

  const resetFilters = useCallback(() => {
    setSearch('');
    setRole('');
    setCurrentPage(1);
  }, []);

  const refreshList = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  // Calculate total pages from API response
  const totalPages = paginationMeta?.total_pages || 1;

  // Fetch data when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Fetch roles on component mount
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    users,
    paginationMeta,
    isLoading,
    error,
    currentPage,
    search,
    role,
    totalPages,
    roleOptions,
    fetchUsers,
    fetchRoles,
    handleSearch,
    handleRoleChange,
    handlePageChange,
    handleDeleteUser,
    resetFilters,
    refreshList,
  };
};
