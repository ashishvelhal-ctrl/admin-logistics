import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useDebounce } from "@/hooks/use-debounce";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const searchTerm = debouncedSearch.trim();

  const {
    data: usersResponse,
    isLoading: isUsersLoading,
    isFetching: isUsersFetching,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["my-network-users", currentPage, searchTerm],
    queryFn: () =>
      networkApi.getUsers({
        limit: PAGE_LIMIT,
        offset: (currentPage - 1) * PAGE_LIMIT,
        search: searchTerm || undefined,
      }),
  });

  const users = Array.isArray(usersResponse?.data) ? usersResponse.data : [];
  const paginationMeta: NetworkPaginationMeta | null =
    usersResponse?.paginationMeta ?? null;

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
    await refetchUsers();
  }, [refetchUsers]);

  const isLoading = isUsersLoading || isUsersFetching;
  const error = usersError instanceof Error ? usersError.message : null;

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
