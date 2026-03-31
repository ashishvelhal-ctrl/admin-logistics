import { useCallback, useEffect, useMemo, useState } from "react";

import { networkApi } from "../services/networkApi";

import type {
  NetworkPaginationMeta,
  NetworkUser,
} from "../services/networkApi";

interface UseMyNetworkListReturn {
  users: NetworkUser[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  search: string;
  paginationMeta: NetworkPaginationMeta | null;
  handleSearch: (value: string) => void;
  handlePageChange: (page: number) => void;
  refreshList: () => Promise<void>;
}

const PAGE_LIMIT = 10;

export function useMyNetworkList(): UseMyNetworkListReturn {
  const [users, setUsers] = useState<NetworkUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [paginationMeta, setPaginationMeta] =
    useState<NetworkPaginationMeta | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await networkApi.getUsers({
        limit: PAGE_LIMIT,
        offset: (currentPage - 1) * PAGE_LIMIT,
        search: search.trim() || undefined,
      });

      setUsers(Array.isArray(response.data) ? response.data : []);
      setPaginationMeta(response.paginationMeta ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      setUsers([]);
      setPaginationMeta(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalPages = useMemo(
    () => paginationMeta?.total_pages || 1,
    [paginationMeta],
  );

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
    },
    [totalPages],
  );

  const refreshList = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    currentPage,
    totalPages,
    search,
    paginationMeta,
    handleSearch,
    handlePageChange,
    refreshList,
  };
}
